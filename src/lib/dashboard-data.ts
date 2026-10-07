import type { Locale } from "@/lib/i18n";
import { dayKey, hashString, seeded, type StoredBooking } from "@/lib/bookings";

/**
 * Sample data for the dashboard. There is no backend yet, so every number here is
 * generated from the visitor's clock with a fixed seed (stable between visits),
 * and bookings made on the website (localStorage) are merged in on top.
 * Replace buildDashboard() with API calls once the database exists.
 */

/** An imaging department and the scans booked inside it (see content/scans.ts). */
export type Exam = { slug: string; abbr: string; name: string; scans: { id: string; name: string }[] };
export type SessionStatus = "done" | "live" | "waiting" | "upcoming";

export type Session = {
  id: string;
  start: Date;
  minutes: number;
  patient: string;
  exam: Exam;
  /** The exact scan, e.g. "Spine MRI". */
  scan: string;
  room: number;
  status: SessionStatus;
};

export type BookingCard = {
  ref: string;
  patient: string;
  exam: Exam;
  scan: string;
  when: Date;
  createdAt: Date;
  fromSite: boolean;
};

export type DayPoint = { date: Date; count: number };

const NAMES: Record<Locale, string[]> = {
  ar: [
    "أحمد محمود", "منى السيد", "يوسف عادل", "سارة إبراهيم", "محمد علي", "نورهان سامي",
    "كريم حسن", "هبة مصطفى", "عمر خالد", "ريم عبد الله", "طارق فؤاد", "دينا مجدي",
    "مصطفى رضا", "ياسمين أشرف", "حسام نبيل", "ليلى شريف", "إياد سمير", "مريم وليد",
    "خالد إسماعيل", "سلمى رأفت",
  ],
  en: [
    "Ahmed Mahmoud", "Mona El Sayed", "Youssef Adel", "Sara Ibrahim", "Mohamed Ali", "Nourhan Samy",
    "Karim Hassan", "Heba Mostafa", "Omar Khaled", "Reem Abdallah", "Tarek Fouad", "Dina Magdy",
    "Mostafa Reda", "Yasmin Ashraf", "Hossam Nabil", "Laila Sherif", "Eyad Samir", "Mariam Walid",
    "Khaled Ismail", "Salma Raafat",
  ],
};

/** How often each exam is booked, in the clinic's service order. */
const WEIGHTS: Record<string, number> = {
  mri: 0.21, ct: 0.19, xray: 0.17, ultrasound: 0.16, mammography: 0.09, dexa: 0.07, pet: 0.06, nuclear: 0.05,
};

const DURATIONS: Record<string, number> = {
  mri: 40, ct: 20, xray: 15, ultrasound: 25, mammography: 20, dexa: 20, pet: 60, nuclear: 45,
};

/** Avatar letters. Arabic names get one letter, so two initials never spell a word by accident. */
export const initials = (name: string) => {
  const words = name.split(" ").filter(Boolean);
  if (/[؀-ۿ]/.test(name)) return words[0]?.[0] ?? "";
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
};

/** A scan inside the department, drawn from its own seeded stream so the rest of the sample stays put. */
const pickScan = (exam: Exam, rnd: () => number) => exam.scans[Math.floor(rnd() * exam.scans.length)]?.name ?? exam.name;

function pickWeighted(rnd: () => number, exams: Exam[]) {
  let r = rnd();
  for (const e of exams) {
    r -= WEIGHTS[e.slug] ?? 0.1;
    if (r <= 0) return e;
  }
  return exams[0];
}

/** Bookings per day for the 30 days ending today. */
export function dailySeries(now: Date): DayPoint[] {
  const out: DayPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const rnd = seeded(hashString(dayKey(d)));
    const weekday = d.getDay();
    const weekly = weekday === 5 ? -11 : weekday === 6 ? -4 : weekday === 0 ? 3 : 0;
    const trend = (29 - i) * 0.18;
    out.push({ date: d, count: Math.max(4, Math.round(21 + weekly + trend + (rnd() - 0.5) * 9)) });
  }
  return out;
}

/** Split a total across exams by their usual share, with a little seeded variation. */
export function splitByExam(total: number, exams: Exam[], seed: number) {
  const rnd = seeded(seed);
  const raw = exams.map((e) => (WEIGHTS[e.slug] ?? 0.1) * (0.85 + rnd() * 0.3));
  const sum = raw.reduce((a, b) => a + b, 0);
  const counts = raw.map((w) => Math.round((w / sum) * total));
  return exams.map((exam, i) => ({ exam, count: counts[i] })).sort((a, b) => b.count - a.count);
}

/** Today's schedule; each session's status follows the visitor's clock. */
export function todaySessions(now: Date, lang: Locale, exams: Exam[]): Session[] {
  const rnd = seeded(hashString(`sessions:${dayKey(now)}`));
  const scanRnd = seeded(hashString(`session-scans:${dayKey(now)}`));
  const names = [...NAMES[lang]];
  const sessions: Session[] = [];
  const t = new Date(now);
  t.setHours(9, 0, 0, 0);
  let i = 0;
  while (sessions.length < 18) {
    const exam = pickWeighted(rnd, exams);
    const minutes = DURATIONS[exam.slug] ?? 20;
    const start = new Date(t);
    const end = start.getTime() + minutes * 60000;
    const status: SessionStatus =
      end <= now.getTime()
        ? "done"
        : start.getTime() <= now.getTime()
          ? "live"
          : start.getTime() - now.getTime() <= 30 * 60000
            ? "waiting"
            : "upcoming";
    const name = names.splice(Math.floor(rnd() * names.length), 1)[0] ?? NAMES[lang][i % NAMES[lang].length];
    const scan = pickScan(exam, scanRnd);
    sessions.push({ id: `S${i}`, start, minutes, patient: name, exam, scan, room: 1 + Math.floor(rnd() * 4), status });
    // Next slot: 30 to 45 minutes later, with a lunch gap after 13:30.
    t.setMinutes(t.getMinutes() + 30 + Math.round(rnd() * 2) * 5);
    const minuteOfDay = t.getHours() * 60 + t.getMinutes();
    if (minuteOfDay >= 13 * 60 + 30 && minuteOfDay < 15 * 60 + 30) t.setHours(15, 30, 0, 0);
    i++;
  }
  return sessions;
}

/** Website bookings first, then sample bookings made at the front desk. */
export function latestBookings(now: Date, lang: Locale, exams: Exam[], stored: StoredBooking[]): BookingCard[] {
  const fromSite: BookingCard[] = stored.slice(0, 4).map((b) => {
    const [y, m, d] = b.date.split("-").map(Number);
    const [hh, mm] = b.time.split(":").map(Number);
    const exam = exams.find((e) => e.slug === b.slug) ?? exams[0];
    return {
      ref: b.ref,
      patient: b.name,
      exam,
      scan: exam.scans.find((sc) => sc.id === b.scan)?.name ?? exam.name,
      when: new Date(y, m - 1, d, hh, mm),
      createdAt: new Date(b.createdAt),
      fromSite: true,
    };
  });
  const rnd = seeded(hashString(`latest:${dayKey(now)}`));
  const scanRnd = seeded(hashString(`latest-scans:${dayKey(now)}`));
  const names = NAMES[lang];
  const sample: BookingCard[] = Array.from({ length: 6 }, (_, i) => {
    const when = new Date(now);
    when.setDate(when.getDate() + 1 + Math.floor(rnd() * 9));
    when.setHours(9 + Math.floor(rnd() * 11), rnd() < 0.5 ? 0 : 30, 0, 0);
    const ref = `BMC-${(1000 + Math.floor(rnd() * 8999)).toString(36).toUpperCase()}`;
    const exam = pickWeighted(rnd, exams);
    return {
      ref,
      patient: names[(i * 7 + 3) % names.length],
      exam,
      scan: pickScan(exam, scanRnd),
      when,
      createdAt: new Date(now.getTime() - (i * 23 + 6 + Math.floor(rnd() * 10)) * 60000),
      fromSite: false,
    };
  });
  return [...fromSite, ...sample].slice(0, 6);
}

export function buildDashboard(now: Date, lang: Locale, exams: Exam[], stored: StoredBooking[]) {
  const series = dailySeries(now);
  const sessions = todaySessions(now, lang, exams);
  const upcomingSite = stored.filter((b) => new Date(`${b.date}T${b.time}`).getTime() > now.getTime()).length;
  const sitePhones = new Set(stored.map((b) => b.phone.replace(/\D/g, ""))).size;
  const last7 = series.slice(-7).reduce((a, p) => a + p.count, 0);
  const prev7 = series.slice(-14, -7).reduce((a, p) => a + p.count, 0);
  return {
    series,
    sessions,
    latest: latestBookings(now, lang, exams, stored),
    kpis: {
      current: 46 + upcomingSite,
      currentDelta: Math.round(((last7 - prev7) / Math.max(1, prev7)) * 100),
      spark: series.slice(-14).map((p) => p.count),
      clients: 1284 + sitePhones,
      newClients: 38 + sitePhones,
      recentNames: NAMES[lang].slice(0, 4),
      todayTotal: sessions.length,
      todayDone: sessions.filter((s) => s.status === "done").length,
    },
  };
}

export type DashboardData = ReturnType<typeof buildDashboard>;
