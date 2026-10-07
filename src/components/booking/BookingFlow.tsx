"use client";

import Link from "next/link";
import type { CSSProperties, FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import OrbitRings from "@/components/brand/OrbitRings";
import Icon from "@/components/ui/Icon";
import type { Dictionary } from "@/content/dictionaries";
import type { Machine } from "@/content/machines";
import type { ScanGroup } from "@/content/scans";
import { dayKey, hashString, makeRef, saveBooking, seeded, type StoredBooking } from "@/lib/bookings";
import type { Locale } from "@/lib/i18n";
import { scrollToTarget } from "@/lib/scroll";
import styles from "./BookingFlow.module.css";

/** A scan department as the booking flow needs it: its scans, plus the machine's facts and prep. */
export type BookableGroup = ScanGroup & Pick<Machine, "duration" | "radiation" | "prep" | "before">;

type Props = { lang: Locale; dict: Dictionary["booking"]["radiology"]; groups: BookableGroup[]; demo: boolean };

/** The short mark shown inside each department's lens. */
const MARKS: Record<string, string> = {
  mri: "MRI",
  ct: "CT",
  xray: "DR",
  ultrasound: "US",
  mammography: "3D",
  dexa: "DXA",
  pet: "PET",
  nuclear: "NM",
};

const MORNING = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"];
const EVENING = ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];
const DAYS_AHEAD = 14;

/** Read only from event handlers (step changes and confirmation), never during render. */
const readClock = () => Date.now();

const localeOf = (lang: Locale) => (lang === "ar" ? "ar-EG-u-nu-latn" : "en-GB");

function slotDate(key: string, time: string) {
  const [y, m, d] = key.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

export default function BookingFlow({ lang, dict, groups, demo }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  /** The department being browsed, and the scan actually chosen (department + scan id). */
  const [browse, setBrowse] = useState(groups[0].slug);
  const [slug, setSlug] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", referral: true, notes: "" });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState<StoredBooking | null>(null);
  /** The visitor clock, read once when they reach the date step. */
  const [clock, setClock] = useState<number | null>(null);

  const locale = localeOf(lang);
  const service = groups.find((g) => g.slug === slug) ?? null;
  const scan = service?.types.find((t) => t.id === scanId) ?? null;
  const browsing = groups.find((g) => g.slug === browse) ?? groups[0];
  const countLabel = (n: number) => (n === 2 ? dict.two : `${n} ${dict.many}`);

  const days = useMemo(() => {
    if (clock === null) return [];
    const base = new Date(clock);
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, [clock]);

  const taken = useMemo(() => {
    if (!slug || !day) return new Set<string>();
    const rnd = seeded(hashString(`${slug}:${scanId}:${day}`));
    const now = (clock ?? 0) + 60 * 60 * 1000;
    return new Set(
      [...MORNING, ...EVENING].filter((t) => rnd() < 0.3 || slotDate(day, t).getTime() < now),
    );
  }, [slug, scanId, day, clock]);

  const fmt = useMemo(
    () => ({
      weekday: new Intl.DateTimeFormat(locale, { weekday: "short" }),
      month: new Intl.DateTimeFormat(locale, { month: "short" }),
      full: new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }),
      time: new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }),
    }),
    [locale],
  );
  const showTime = (key: string, t: string) => fmt.time.format(slotDate(key, t));

  const go = (next: number) => {
    if (next >= 1 && clock === null) setClock(readClock());
    setDir(next > step ? 1 : -1);
    setStep(next);
    if (rootRef.current) scrollToTarget(rootRef.current, { offset: -110 });
  };

  const canNext = [Boolean(scan), Boolean(day && time), true, true][step];

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().split(/\s+/).filter(Boolean).length < 2) e.name = dict.errName;
    if (!/^(\+?\d{10,15}|01\d{9})$/.test(form.phone.replace(/[\s-]/g, ""))) e.phone = dict.errPhone;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onNext = (e?: FormEvent) => {
    e?.preventDefault();
    if (step === 2 && !validate()) return;
    if (step < 3) go(step + 1);
  };

  const confirm = () => {
    if (!slug || !scanId || !day || !time) return;
    const booking: StoredBooking = {
      ref: makeRef(),
      slug,
      scan: scanId,
      date: day,
      time,
      name: form.name.trim(),
      phone: form.phone.trim(),
      referral: form.referral,
      notes: form.notes.trim(),
      createdAt: readClock(),
    };
    saveBooking(booking);
    setDone(booking);
    if (rootRef.current) scrollToTarget(rootRef.current, { offset: -110 });
  };

  const restart = () => {
    setDone(null);
    setSlug(null);
    setScanId(null);
    setDay(null);
    setTime(null);
    setForm({ name: "", phone: "", referral: true, notes: "" });
    setDir(-1);
    setStep(0);
  };

  /* ---------- Confirmation ---------- */
  if (done && service && scan) {
    return (
      <div ref={rootRef} className={styles.flow}>
        <div className={styles.success}>
          <svg className={styles.tick} viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="36" pathLength={1} />
            <path d="m25 41 10 10 20-22" pathLength={1} />
          </svg>
          <h2 className={styles.successTitle} aria-live="polite">
            {dict.successTitle}
          </h2>
          <p className={styles.successText}>{dict.successText}</p>

          <article className={styles.ticket}>
            <div className={styles.stub}>
              <span className={styles.stubDay}>{new Date(slotDate(done.date, done.time)).getDate()}</span>
              <span className={styles.stubMonth}>{fmt.month.format(slotDate(done.date, done.time))}</span>
              <span className={styles.stubTime}>
                {showTime(done.date, done.time)}
              </span>
            </div>
            <div className={styles.ticketBody}>
              <p className={styles.ticketRefLabel}>{dict.ref}</p>
              <p className={`${styles.ticketRef} latin`}>{done.ref}</p>
              <dl className={styles.ticketMeta}>
                <div>
                  <dt>{dict.exam}</dt>
                  <dd>
                    {scan.name} <span className={`${styles.chip} latin`}>{service.abbr}</span>
                  </dd>
                </div>
                <div>
                  <dt>{dict.date}</dt>
                  <dd>{fmt.full.format(slotDate(done.date, done.time))}</dd>
                </div>
                <div>
                  <dt>{dict.patient}</dt>
                  <dd>{done.name}</dd>
                </div>
              </dl>
            </div>
          </article>

          <div className={styles.prep}>
            <h3 className={styles.prepTitle}>{dict.prepTitle}</h3>
            <ol>
              {service.before.map((line, i) => (
                <li key={line} style={{ "--i": i } as CSSProperties}>
                  <span className="latin">{i + 1}</span>
                  {line}
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.successActions}>
            <Link href={`/${lang}`} className="btn btn-primary">
              <span>{dict.home}</span>
              <span className="btn-ico">
                <Icon name="arrow" />
              </span>
            </Link>
            <button type="button" className="btn btn-ghost on-light" onClick={restart}>
              {dict.another}
            </button>
          </div>
          {demo && <p className={styles.demo}>{dict.demo}</p>}
        </div>
      </div>
    );
  }

  /* ---------- The four steps ---------- */
  return (
    <div ref={rootRef} className={styles.flow}>
      <ol className={styles.stepper} style={{ "--p": step / 3 } as CSSProperties}>
        {dict.steps.map((label, i) => (
          <li key={label} data-state={i < step ? "done" : i === step ? "current" : "next"} aria-current={i === step ? "step" : undefined}>
            <button type="button" className={styles.stepDot} disabled={i >= step} onClick={() => go(i)}>
              {i < step ? <Icon name="check" /> : <span className="latin">{i + 1}</span>}
            </button>
            <span className={styles.stepLabel}>{label}</span>
          </li>
        ))}
      </ol>

      <form className={styles.stage} onSubmit={onNext} noValidate>
        <div key={step} className={styles.panel} data-dir={dir}>
          {step === 0 && (
            <>
              <header className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{dict.pickTitle}</h2>
                <p className={styles.panelLead}>{dict.pickLead}</p>
              </header>
              {/* The departments: one lens each, the open one turns dark. */}
              <div className={styles.groups} role="tablist" aria-label={dict.groupsLabel}>
                {groups.map((g, i) => (
                  <button
                    key={g.slug}
                    type="button"
                    role="tab"
                    id={`tab-${g.slug}`}
                    aria-selected={browse === g.slug}
                    aria-controls="scan-panel"
                    className={styles.group}
                    style={{ "--i": i, "--tone": `var(--c-${g.tone})` } as CSSProperties}
                    onClick={() => setBrowse(g.slug)}
                  >
                    <span className={styles.groupLens} aria-hidden="true">
                      <OrbitRings className={styles.groupRings} />
                      <span className={`${styles.groupMark} latin`}>{MARKS[g.slug] ?? g.abbr}</span>
                    </span>
                    <span className={styles.groupName}>{g.name}</span>
                    <span className={styles.groupCount}>{countLabel(g.types.length)}</span>
                    {slug === g.slug && <span className={styles.groupPicked} aria-hidden="true" />}
                  </button>
                ))}
              </div>

              <div
                key={browsing.slug}
                id="scan-panel"
                role="tabpanel"
                aria-labelledby={`tab-${browsing.slug}`}
                className={styles.groupPanel}
                style={{ "--tone": `var(--c-${browsing.tone})` } as CSSProperties}
              >
                <aside className={styles.groupInfo}>
                  <span className={`${styles.spec} latin`} dir="ltr">
                    {browsing.abbr}
                    <i aria-hidden="true" />
                    {browsing.spec}
                  </span>
                  <h3 className={styles.groupTitle}>{browsing.name}</h3>
                  <p className={styles.groupSummary}>{browsing.summary}</p>
                  <dl className={styles.groupFacts}>
                    <div>
                      <dt>
                        <Icon name="timer" />
                        {dict.duration}
                      </dt>
                      <dd>{browsing.duration}</dd>
                    </div>
                    <div>
                      <dt>
                        <Icon name="wave" />
                        {dict.radiation}
                      </dt>
                      <dd>{browsing.radiation}</dd>
                    </div>
                    <div>
                      <dt>
                        <Icon name="list" />
                        {dict.prep}
                      </dt>
                      <dd>{browsing.prep}</dd>
                    </div>
                  </dl>
                </aside>

                <ul className={styles.scans} aria-label={dict.pickScan}>
                  {browsing.types.map((t, i) => {
                    const picked = slug === browsing.slug && scanId === t.id;
                    return (
                      <li key={t.id} style={{ "--i": i } as CSSProperties}>
                        <button
                          type="button"
                          className={styles.scan}
                          aria-pressed={picked}
                          onClick={() => {
                            setSlug(browsing.slug);
                            setScanId(t.id);
                            setTime(null);
                          }}
                        >
                          <span className={`${styles.scanIndex} latin`} aria-hidden="true">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={styles.scanName}>{t.name}</span>
                          <span className={styles.scanUse}>{t.use}</span>
                          <span className={styles.scanMeta}>
                            <span className={styles.scanTime}>
                              <Icon name="timer" />
                              {t.duration}
                            </span>
                            {t.flags.map((f) => (
                              <span key={f} className={styles.flag} data-flag={f}>
                                {dict.flags[f]}
                              </span>
                            ))}
                          </span>
                          <span className={styles.check} aria-hidden="true">
                            <Icon name="check" />
                          </span>
                          <span className="sr-only">{picked ? dict.selected : ""}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <header className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{dict.whenTitle}</h2>
                {service && scan && (
                  <p className={styles.panelLead}>
                    {scan.name} <span className={`${styles.chip} latin`}>{service.abbr}</span>
                  </p>
                )}
              </header>
              <div className={styles.days} role="radiogroup" aria-label={dict.date}>
                {days.map((d, i) => {
                  const key = dayKey(d);
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={day === key}
                      className={styles.day}
                      style={{ "--i": i } as CSSProperties}
                      onClick={() => {
                        setDay(key);
                        setTime(null);
                      }}
                    >
                      <span className={styles.dayName}>{i === 0 ? dict.today : fmt.weekday.format(d)}</span>
                      <span className={`${styles.dayNum} latin`}>{d.getDate()}</span>
                      <span className={styles.dayMonth}>{fmt.month.format(d)}</span>
                    </button>
                  );
                })}
              </div>

              {day && (
                <div className={styles.slots}>
                  {[
                    [dict.morning, MORNING],
                    [dict.evening, EVENING],
                  ].map(([label, list]) => (
                    <fieldset key={label as string} className={styles.slotGroup}>
                      <legend>{label as string}</legend>
                      <div className={styles.slotGrid}>
                        {(list as string[]).map((t, i) => {
                          const isTaken = taken.has(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              className={styles.slot}
                              aria-pressed={time === t}
                              disabled={isTaken}
                              style={{ "--i": i } as CSSProperties}
                              onClick={() => setTime(t)}
                            >
                              <span>
                                {showTime(day, t)}
                              </span>
                              {isTaken && <small>{dict.taken}</small>}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <header className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{dict.detailsTitle}</h2>
              </header>
              <div className={styles.fields}>
                <label className={styles.field} data-invalid={errors.name ? "" : undefined}>
                  <span>{dict.name}</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    placeholder={dict.namePh}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="err-name"
                  />
                  <em id="err-name" aria-live="polite">
                    {errors.name}
                  </em>
                </label>
                <label className={styles.field} data-invalid={errors.phone ? "" : undefined}>
                  <span>{dict.phone}</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    className="latin"
                    value={form.phone}
                    placeholder={dict.phonePh}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby="err-phone"
                  />
                  <em id="err-phone" aria-live="polite">
                    {errors.phone}
                  </em>
                </label>
                <fieldset className={styles.choice}>
                  <legend>{dict.referral}</legend>
                  {[
                    [true, dict.yes],
                    [false, dict.no],
                  ].map(([value, label]) => (
                    <label key={String(value)} className={styles.pill}>
                      <input
                        type="radio"
                        name="referral"
                        checked={form.referral === value}
                        onChange={() => setForm({ ...form, referral: value as boolean })}
                      />
                      <span>{label as string}</span>
                    </label>
                  ))}
                </fieldset>
                <label className={`${styles.field} ${styles.wide}`}>
                  <span>{dict.notes}</span>
                  <textarea
                    rows={3}
                    value={form.notes}
                    placeholder={dict.notesPh}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </label>
              </div>
            </>
          )}

          {step === 3 && service && scan && day && time && (
            <>
              <header className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{dict.reviewTitle}</h2>
              </header>
              <dl className={styles.review}>
                {[
                  [dict.exam, `${scan.name} · ${service.name}`, 0],
                  [dict.date, fmt.full.format(slotDate(day, time)), 1],
                  [dict.time, showTime(day, time), 1],
                  [dict.patient, form.name, 2],
                  [dict.phoneLabel, form.phone, 2],
                ].map(([label, value, target]) => (
                  <div key={label as string} className={styles.reviewRow}>
                    <dt>{label as string}</dt>
                    <dd dir={label === dict.phoneLabel ? "ltr" : undefined}>{value as string}</dd>
                    <button type="button" className={styles.editLink} onClick={() => go(target as number)}>
                      {dict.edit}
                    </button>
                  </div>
                ))}
              </dl>
              {demo && <p className={styles.demo}>{dict.demo}</p>}
            </>
          )}
        </div>

        <div className={styles.actions}>
          {step > 0 ? (
            <button type="button" className="btn btn-ghost on-light" onClick={() => go(step - 1)}>
              {dict.back}
            </button>
          ) : scan ? (
            <p className={styles.picked} aria-live="polite">
              <span className={styles.pickedTick} aria-hidden="true">
                <Icon name="check" />
              </span>
              <span>
                <small>{dict.selected}</small>
                <strong>{scan.name}</strong>
              </span>
            </p>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="submit" className="btn btn-primary" disabled={!canNext}>
              <span>{dict.next}</span>
              <span className="btn-ico">
                <Icon name="arrow" />
              </span>
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={confirm}>
              <span>{dict.confirm}</span>
              <span className="btn-ico">
                <Icon name="check" />
              </span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
