"use client";

import type { ReactNode } from "react";
import { useOpenBooking } from "./BookingProvider";

/** Opens the department chooser, which grows out of this button. */
export default function BookingTrigger({ className, children }: { className?: string; children: ReactNode }) {
  const open = useOpenBooking();
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        open({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      {children}
    </button>
  );
}
