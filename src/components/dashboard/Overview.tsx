"use client";

import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Icon from "@/components/ui/Icon";
import type { Dictionary } from "@/content/dictionaries";
import { readBookings, type StoredBooking } from "@/lib/bookings";
import {
  buildDashboard,
  initials,
  splitByExam,
  type BookingCard,
  type DayPoint,
  type Exam,
  type Session,
} from "@/lib/dashboard-data";
import type { Locale } from "@/lib/i18n";
import { DashboardReady } from "./DashboardShell";
import styles from "./Overview.module.css";

type Dict = Dictionary["dashboard"];
type Props = { lang: Locale; dict: Dict; exams: Exam[] };

/* The visitor's clock and saved bookings, read once per visit to this page.
   Read through an external store so the server render and hydration agree. */
let snapshot: { now: Date; stored: StoredBooking[] } | null = null;
const subscribe = () => () => {};
const getSnapshot = () => (snapshot ??= { now: new Date(), stored: readBookings() });
const getServerSnapshot = () => null;

const RANGES = [7, 14, 30] as const;
const localeOf = (lang: Locale) => (lang === "ar" ? "ar-EG-u-nu-latn" : "en-GB");

/** Counts up to a value once the dashboard is ready. */
function useCountUp(target: number, run: boolean, ms = 1300) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return value;
}

export default function Overview({ lang, dict, exams }: Props) {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => () => void (snapshot = null), []);
  const ready = useContext(DashboardReady);
  const [range, setRange] = useState<(typeof RANGES)[number]>(14);
  const o = dict.overview;
  const locale = localeOf(lang);

  const data = useMemo(() => (snap ? buildDashboard(snap.now, lang, exams, snap.stored) : null), [snap, lang, exams]);
  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const greeting = snap ? (snap.now.getHours() < 12 ? dict.morning : dict.evening) : " ";
  const dateLine = snap
    ? new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(snap.now)
    : " ";

  return (
    <div className={styles.page}>
      <header className={`${styles.head} enter`} style={{ "--i": 0 } as CSSProperties}>
        <div>
          <p className={styles.hello}>
            {greeting}
            <span className={styles.wave} aria-hidden="true" />
          </p>
          <h1 className={styles.title}>{o.title}</h1>
          <p className={styles.lead}>
            {o.lead} <span className={styles.date}>{dateLine}</span>
          </p>
        </div>
        <div className={styles.rangeWrap}>
          <span className={styles.rangeLabel}>{o.range}</span>
          <div className={styles.range} role="radiogroup" aria-label={o.range} style={{ "--r": RANGES.indexOf(range) } as CSSProperties}>
            <span className={styles.rangeThumb} aria-hidden="true" />
            {RANGES.map((r, i) => (
              <button key={r} type="button" role="radio" aria-checked={range === r} onClick={() => setRange(r)}>
                {o.ranges[i]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {!data ? (
        <Skeleton />
      ) : (
        <>
          <section className={styles.kpis} aria-label={o.title}>
            <KpiBookings data={data} dict={dict} nf={nf} ready={ready} />
            <KpiClients data={data} dict={dict} nf={nf} ready={ready} />
            <KpiToday data={data} dict={dict} nf={nf} ready={ready} />
          </section>

          <section className={styles.row}>
            <BookingsChart
              key={range}
              points={data.series.slice(-range)}
              lang={lang}
              dict={o.chart}
              nf={nf}
            />
            <ByType points={data.series.slice(-range)} exams={exams} range={range} dict={o.byType} nf={nf} />
          </section>

          <section className={styles.rowAlt}>
            <TodaySessions sessions={data.sessions} lang={lang} dict={o.today} />
            <Latest cards={data.latest} lang={lang} dict={o.latest} now={snap!.now} />
          </section>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- KPI cards */

type KpiProps = { data: NonNullable<ReturnType<typeof buildDashboard>>; dict: Dict; nf: Intl.NumberFormat; ready: boolean };

function Delta({ value, label }: { value: number; label: string }) {
  const up = value >= 0;
  return (
    <span className={styles.delta} data-up={up || undefined}>
      <Icon name="up" />
      <span className="latin" dir="ltr">
        {up ? "+" : ""}
        {value}%
      </span>
      <span className={styles.deltaLabel}>{label}</span>
    </span>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 100, 34 - ((v - min) / Math.max(1, max - min)) * 28]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg className={styles.spark} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d} L100 40 L0 40 Z`} className={styles.sparkArea} />
      <path d={d} className={styles.sparkLine} pathLength={1} vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r="2.6" className={styles.sparkDot} />
    </svg>
  );
}

function KpiBookings({ data, dict, nf, ready }: KpiProps) {
  const k = dict.overview.kpis;
  const n = useCountUp(data.kpis.current, ready);
  return (
    <article className={`${styles.kpi} enter`} style={{ "--i": 1 } as CSSProperties}>
      <div className={styles.kpiTop}>
        <span className={styles.kpiIcon}>
          <Icon name="ticket" />
        </span>
        <Delta value={data.kpis.currentDelta} label={k.vsLastWeek} />
      </div>
      <p className={`${styles.kpiValue} latin`}>{nf.format(n)}</p>
      <h2 className={styles.kpiLabel}>{k.current}</h2>
      <p className={styles.kpiNote}>{k.currentNote}</p>
      <Sparkline values={data.kpis.spark} />
    </article>
  );
}

function KpiClients({ data, dict, nf, ready }: KpiProps) {
  const k = dict.overview.kpis;
  const n = useCountUp(data.kpis.clients, ready, 1600);
  return (
    <article className={`${styles.kpi} enter`} style={{ "--i": 2 } as CSSProperties}>
      <div className={styles.kpiTop}>
        <span className={styles.kpiIcon}>
          <Icon name="users" />
        </span>
        <span className={styles.delta} data-up="">
          <Icon name="up" />
          <span className="latin" dir="ltr">
            +{data.kpis.newClients}
          </span>
        </span>
      </div>
      <p className={`${styles.kpiValue} latin`}>{nf.format(n)}</p>
      <h2 className={styles.kpiLabel}>{k.clients}</h2>
      <div className={styles.faces}>
        <span className={styles.faceRow} aria-hidden="true">
          {data.kpis.recentNames.map((name, i) => (
            <span key={name} className={styles.face} style={{ "--i": i } as CSSProperties}>
              {initials(name)}
            </span>
          ))}
          <span className={`${styles.face} ${styles.faceMore} latin`}>+{data.kpis.newClients - 4}</span>
        </span>
        <span className={styles.kpiNote}>
          <span className="latin">{data.kpis.newClients}</span> {k.clientsNote}
        </span>
      </div>
    </article>
  );
}

function KpiToday({ data, dict, nf, ready }: KpiProps) {
  const k = dict.overview.kpis;
  const total = data.kpis.todayTotal;
  const doneCount = data.kpis.todayDone;
  const n = useCountUp(total, ready, 1000);
  const share = total ? doneCount / total : 0;
  return (
    <article className={`${styles.kpi} ${styles.kpiDark} enter`} style={{ "--i": 3, "--share": share } as CSSProperties}>
      <div className={styles.kpiTop}>
        <span className={styles.kpiIcon}>
          <Icon name="calendar" />
        </span>
      </div>
      <div className={styles.todayRow}>
        <div>
          <p className={`${styles.kpiValue} latin`}>{nf.format(n)}</p>
          <h2 className={styles.kpiLabel}>{k.today}</h2>
          <p className={styles.kpiNote}>
            <span className="latin">{doneCount}</span> {k.todayNote}
          </p>
        </div>
        <svg className={styles.meter} viewBox="0 0 120 120" role="img" aria-label={`${doneCount} / ${total}`}>
          <circle cx="60" cy="60" r="50" className={styles.meterTrack} />
          <circle cx="60" cy="60" r="50" pathLength={1} className={styles.meterFill} />
          <text x="60" y="58" textAnchor="middle" className={`${styles.meterValue} latin`}>
            {Math.round(share * 100)}%
          </text>
          <text x="60" y="78" textAnchor="middle" className={`${styles.meterSub} latin`}>
            {doneCount}/{total}
          </text>
        </svg>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------- Bookings chart */

/** Monotone cubic path (Fritsch-Carlson): smooth, never overshoots the data. */
function monotonePath(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return "";
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  t[n - 1] = m[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${(pts[i][0] + h).toFixed(1)} ${(pts[i][1] + t[i] * h).toFixed(1)} ${(pts[i + 1][0] - h).toFixed(1)} ${(pts[i + 1][1] - t[i + 1] * h).toFixed(1)} ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
  }
  return d;
}

type ChartProps = { points: DayPoint[]; lang: Locale; dict: Dict["overview"]["chart"]; nf: Intl.NumberFormat };

function BookingsChart({ points, lang, dict, nf }: ChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 720, height: 270 });
  const width = size.width;
  const [active, setActive] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const rtl = lang === "ar";
  const locale = localeOf(lang);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // The plot fills whatever height its card is given, so the card never shows a dead band.
    const ro = new ResizeObserver(([e]) =>
      setSize({ width: Math.max(280, Math.round(e.contentRect.width)), height: Math.max(240, Math.round(e.contentRect.height)) }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [table]);

  const H = size.height;
  const top = 26;
  const bottom = 36;
  const axisW = 40;
  const counts = points.map((p) => p.count);
  const total = counts.reduce((a, b) => a + b, 0);
  const avg = total / counts.length;
  const peakIndex = counts.indexOf(Math.max(...counts));
  const max = Math.ceil((Math.max(...counts) * 1.12) / 10) * 10;
  const ticks = Array.from({ length: max / 10 + 1 }, (_, i) => i * 10).filter((v) => max <= 40 || v % 20 === 0);

  // Time reads in the language's direction: in Arabic the newest day sits on the left.
  const px0 = rtl ? 14 : axisW;
  const px1 = rtl ? width - axisW : width - 14;
  const x = (i: number) => {
    const f = points.length === 1 ? 0 : i / (points.length - 1);
    return rtl ? px1 - f * (px1 - px0) : px0 + f * (px1 - px0);
  };
  const y = (v: number) => top + (H - top - bottom) * (1 - v / max);
  const pts = points.map((p, i) => [x(i), y(p.count)] as [number, number]);
  const line = monotonePath(pts);
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H - bottom} L${pts[0][0].toFixed(1)} ${H - bottom} Z`;

  const dayFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  const longFmt = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" });
  // About one date label per 78px, so narrow phones get three labels and never overlap.
  const every = Math.ceil(points.length / Math.max(3, Math.min(7, Math.floor((px1 - px0) / 78))));

  const pick = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = clientX - rect.left;
    let best = 0;
    pts.forEach(([vx], i) => {
      if (Math.abs(vx - px) < Math.abs(pts[best][0] - px)) best = i;
    });
    setActive(best);
  };

  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const visualRight = e.key === "ArrowRight";
    const step = visualRight !== rtl ? 1 : -1;
    setActive((a) => Math.min(points.length - 1, Math.max(0, (a ?? points.length - 1) + step)));
  };

  const tip = active !== null ? points[active] : null;

  return (
    <article className={`${styles.card} ${styles.chartCard} enter`} style={{ "--i": 4 } as CSSProperties}>
      <header className={styles.cardHead}>
        <div>
          <h2 className={styles.cardTitle}>{dict.title}</h2>
          <p className={styles.cardSub}>{dict.sub}</p>
        </div>
        <div className={styles.toggle} role="group">
          <button type="button" aria-pressed={!table} onClick={() => setTable(false)}>
            {dict.graph}
          </button>
          <button type="button" aria-pressed={table} onClick={() => setTable(true)}>
            {dict.table}
          </button>
        </div>
      </header>

      <dl className={styles.stats}>
        <div>
          <dt>{dict.total}</dt>
          <dd className="latin">{nf.format(total)}</dd>
        </div>
        <div>
          <dt>{dict.avg}</dt>
          <dd className="latin">{nf.format(Math.round(avg * 10) / 10)}</dd>
        </div>
        <div>
          <dt>{dict.peak}</dt>
          <dd>
            <span className="latin">{nf.format(counts[peakIndex])}</span>
            <small>{dayFmt.format(points[peakIndex].date)}</small>
          </dd>
        </div>
      </dl>

      {table ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{dict.day}</th>
                <th scope="col">{dict.count}</th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map((p) => (
                <tr key={p.date.getTime()}>
                  <td>{longFmt.format(p.date)}</td>
                  <td className="latin">{nf.format(p.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          ref={wrapRef}
          className={styles.plot}
          tabIndex={0}
          role="img"
          aria-label={`${dict.title}: ${dict.total} ${total}, ${dict.peak} ${counts[peakIndex]}`}
          onPointerMove={(e) => pick(e.clientX)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(points.length - 1)}
          onBlur={() => setActive(null)}
          onKeyDown={onKey}
        >
          <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} aria-hidden="true">
            <defs>
              <linearGradient id="bookings-wash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0c81e4" stopOpacity="0.18" />
                <stop offset="1" stopColor="#0c81e4" stopOpacity="0" />
              </linearGradient>
            </defs>
            {ticks.map((v) => (
              <g key={v}>
                <line x1={px0} x2={px1} y1={y(v)} y2={y(v)} className={styles.grid} />
                <text x={rtl ? width - 6 : 6} y={y(v) + 4} textAnchor={rtl ? "end" : "start"} className={`${styles.tick} latin`}>
                  {v}
                </text>
              </g>
            ))}
            {points.map((p, i) =>
              i % every === (points.length - 1) % every ? (
                <text key={i} x={x(i)} y={H - 12} textAnchor="middle" className={styles.tick}>
                  {dayFmt.format(p.date)}
                </text>
              ) : null,
            )}
            <path d={area} className={styles.area} />
            <path d={line} className={styles.line} pathLength={1} />
            {/* The busiest day carries the one direct label. */}
            <g className={styles.peak}>
              <circle cx={pts[peakIndex][0]} cy={pts[peakIndex][1]} r="5" />
              <text x={pts[peakIndex][0]} y={pts[peakIndex][1] - 12} textAnchor="middle" className="latin">
                {counts[peakIndex]}
              </text>
            </g>
            {active !== null && (
              <g className={styles.cross}>
                <line x1={pts[active][0]} x2={pts[active][0]} y1={top - 6} y2={H - bottom} />
                <circle cx={pts[active][0]} cy={pts[active][1]} r="6" />
              </g>
            )}
          </svg>
          {tip && active !== null && (
            <div
              className={styles.tooltip}
              style={{
                left: Math.min(Math.max(pts[active][0], 80), width - 80),
                top: Math.max(8, pts[active][1] - 74),
              }}
            >
              <strong className="latin">
                {nf.format(tip.count)} <span>{dict.unit}</span>
              </strong>
              <span>{longFmt.format(tip.date)}</span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------ By exam type */

function ByType({
  points,
  exams,
  range,
  dict,
  nf,
}: {
  points: DayPoint[];
  exams: Exam[];
  range: number;
  dict: Dict["overview"]["byType"];
  nf: Intl.NumberFormat;
}) {
  const total = points.reduce((a, p) => a + p.count, 0);
  const rows = splitByExam(total, exams, range * 97);
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <article className={`${styles.card} enter`} style={{ "--i": 5 } as CSSProperties}>
      <header className={styles.cardHead}>
        <div>
          <h2 className={styles.cardTitle}>{dict.title}</h2>
          <p className={styles.cardSub}>{dict.sub}</p>
        </div>
      </header>
      <ul className={styles.bars} key={range}>
        {rows.map((r, i) => (
          <li key={r.exam.slug} style={{ "--w": r.count / max, "--i": i } as CSSProperties}>
            <span className={styles.barName}>
              <span className={`${styles.abbr} latin`}>{r.exam.abbr}</span>
              <span>{r.exam.name}</span>
            </span>
            <span className={styles.barTrack}>
              <span className={styles.barFill} />
            </span>
            <span className={`${styles.barValue} latin`}>
              {nf.format(r.count)}
              <small>{Math.round((r.count / total) * 100)}%</small>
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ---------------------------------------------------------- Today sessions */

const STATUS_ICON = { done: "check", live: "wave", waiting: "hourglass", upcoming: "clock" } as const;

function TodaySessions({
  sessions,
  lang,
  dict,
}: {
  sessions: Session[];
  lang: Locale;
  dict: Dict["overview"]["today"];
}) {
  const timeFmt = new Intl.DateTimeFormat(localeOf(lang), { hour: "numeric", minute: "2-digit" });
  const listRef = useRef<HTMLOListElement>(null);
  const liveIndex = sessions.findIndex((s) => s.status === "live" || s.status === "waiting");

  // Bring the session happening now into view inside the list.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[Math.max(0, liveIndex - 1)] as HTMLElement | undefined;
    if (list && item && liveIndex > 1) list.scrollTo({ top: item.offsetTop - list.offsetTop, behavior: "smooth" });
  }, [liveIndex]);

  return (
    <article className={`${styles.card} enter`} style={{ "--i": 6 } as CSSProperties}>
      <header className={styles.cardHead}>
        <div>
          <h2 className={styles.cardTitle}>{dict.title}</h2>
          <p className={styles.cardSub}>
            <span className="latin">{sessions.filter((s) => s.status === "done").length}</span> / <span className="latin">{sessions.length}</span>
          </p>
        </div>
      </header>
      <ol ref={listRef} className={styles.sessions}>
        {sessions.map((s, i) => (
          <li key={s.id} className={styles.session} data-status={s.status} style={{ "--i": i } as CSSProperties}>
            <span className={styles.sTime}>
              {timeFmt.format(s.start)}
            </span>
            <span className={styles.sNode} aria-hidden="true" />
            <div className={styles.sCard}>
              <span className={styles.sAvatar} aria-hidden="true">
                {initials(s.patient)}
              </span>
              <div className={styles.sBody}>
                <strong>{s.patient}</strong>
                <span className={styles.sMeta} title={s.scan}>
                  <span className={`${styles.abbr} latin`}>{s.exam.abbr}</span>
                  {s.scan}
                </span>
                <span className={styles.sRoom}>
                  {dict.room} <span className="latin">{s.room}</span>
                </span>
              </div>
              <span className={styles.status} data-status={s.status}>
                <Icon name={STATUS_ICON[s.status]} />
                {dict.statuses[s.status]}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

/* --------------------------------------------------------- Latest bookings */

function Latest({ cards, lang, dict, now }: { cards: BookingCard[]; lang: Locale; dict: Dict["overview"]["latest"]; now: Date }) {
  const locale = localeOf(lang);
  const day = new Intl.DateTimeFormat(locale, { day: "numeric" });
  const month = new Intl.DateTimeFormat(locale, { month: "short" });
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" });
  const time = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" });
  const rel = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const ago = (d: Date) => {
    const mins = Math.round((d.getTime() - now.getTime()) / 60000);
    return Math.abs(mins) < 60 ? rel.format(mins, "minute") : rel.format(Math.round(mins / 60), "hour");
  };

  return (
    <article className={`${styles.card} enter`} style={{ "--i": 7 } as CSSProperties}>
      <header className={styles.cardHead}>
        <div>
          <h2 className={styles.cardTitle}>{dict.title}</h2>
        </div>
        <span className={styles.viewAll}>
          {dict.viewAll}
          <Icon name="arrow" />
        </span>
      </header>
      <ul className={styles.tickets}>
        {cards.map((c, i) => (
          <li key={c.ref + i} className={styles.ticket} data-site={c.fromSite || undefined} style={{ "--i": i } as CSSProperties}>
            <div className={styles.tStub}>
              <span className={`${styles.tDay} latin`}>{day.format(c.when)}</span>
              <span className={styles.tMonth}>{month.format(c.when)}</span>
            </div>
            <div className={styles.tBody}>
              <div className={styles.tTop}>
                <span className={`${styles.tRef} latin`}>{c.ref}</span>
                {c.fromSite && <span className={styles.siteTag}>{dict.fromSite}</span>}
              </div>
              <strong className={styles.tName}>{c.patient}</strong>
              <span className={styles.tExam}>
                <span className={`${styles.abbr} latin`}>{c.exam.abbr}</span>
                {c.scan}
              </span>
              <span className={styles.tWhen}>
                {weekday.format(c.when)}
                <span className={styles.sDot} aria-hidden="true" />
                <span>
                  {time.format(c.when)}
                </span>
              </span>
              <span className={styles.tAgo}>{ago(c.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ---------------------------------------------------------------- Skeleton */

function Skeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.kpis}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${styles.kpi} ${styles.ghost}`} />
        ))}
      </div>
      <div className={styles.row}>
        <div className={`${styles.card} ${styles.ghost}`} style={{ minHeight: 420 }} />
        <div className={`${styles.card} ${styles.ghost}`} style={{ minHeight: 420 }} />
      </div>
    </div>
  );
}
