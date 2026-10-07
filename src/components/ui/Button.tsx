import Link from "next/link";
import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "light" | "ghost";
  icon?: IconName | null;
  className?: string;
  external?: boolean;
};

/** A pill with a round gradient icon: the brand's curved button. */
export default function Button({ href, children, variant = "primary", icon = "arrow", className = "", external }: Props) {
  const cls = `btn btn-${variant} ${className}`.trim();
  const inner = (
    <>
      <span>{children}</span>
      {icon && variant !== "ghost" && (
        <span className="btn-ico">
          <Icon name={icon} />
        </span>
      )}
    </>
  );
  const isPlain = external || href.startsWith("tel:") || href.startsWith("mailto:");
  if (isPlain) {
    return (
      <a className={cls} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {inner}
    </Link>
  );
}
