"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { requestDashboardIntro } from "@/lib/dash-intro";

/** A link into the dashboard that asks for the website-to-dashboard loader. */
export default function DashboardLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={className} onClick={(e) => requestDashboardIntro(e)}>
      {children}
    </Link>
  );
}
