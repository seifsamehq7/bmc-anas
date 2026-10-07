/**
 * Front-end-only booking store. There is no backend yet, so bookings made on the
 * website are kept in this browser's localStorage, and the dashboard reads them back.
 * Swap these three functions for API calls when the booking system is connected.
 */

export type StoredBooking = {
  ref: string;
  /** The imaging department (matches a machine slug). */
  slug: string;
  /** The scan inside that department (see content/scans.ts). Older bookings may not have it. */
  scan?: string;
  /** Local calendar day, YYYY-MM-DD. */
  date: string;
  /** 24-hour time, HH:MM. */
  time: string;
  name: string;
  phone: string;
  referral: boolean;
  notes: string;
  createdAt: number;
};

const KEY = "bmc-bookings";

export function readBookings(): StoredBooking[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as StoredBooking[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: StoredBooking) {
  try {
    const list = [booking, ...readBookings()].slice(0, 60);
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Private mode or storage blocked: the confirmation still shows.
  }
}

export function makeRef(now = Date.now()) {
  const n = (now % 46656) * 36 + Math.floor(Math.random() * 36);
  return `BMC-${n.toString(36).toUpperCase().padStart(4, "0").slice(-4)}`;
}

/** YYYY-MM-DD for a local date. */
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Deterministic pseudo-random generator, so "booked" slots and sample data are stable. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export const hashString = (str: string) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
};
