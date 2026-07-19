"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboard } from "@/lib/content";

const VARIANT_STYLES = {
  sidebar: {
    base: "block rounded-button px-3 py-3 text-sm font-medium",
    active: "bg-white/10 text-white",
    inactive: "text-white/80 hover:bg-white/10 hover:text-white",
  },
  mobile: {
    base: "block rounded-button px-3 py-3 text-base font-medium",
    active: "bg-sand text-navy",
    inactive: "text-ink hover:bg-sand",
  },
} as const;

export default function DashboardNav({
  variant,
  onNavigate,
}: {
  variant: keyof typeof VARIANT_STYLES;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const styles = VARIANT_STYLES[variant];

  return (
    <nav className={variant === "sidebar" ? "space-y-1 px-3" : "flex flex-col gap-1"}>
      {dashboard.navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`${styles.base} ${isActive ? styles.active : styles.inactive}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
