"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Tasks" },
  { href: "/calendar", label: "Calendar" },
] as const;

export function TopNav(): React.ReactElement {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur">
      <nav className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-6">
        <Link href="/" className="font-semibold tracking-tight text-lavender">
          ✦ Todo
        </Link>
        <ul className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    "px-3 py-1.5 rounded-full text-sm transition-colors " +
                    (active
                      ? "bg-accent/20 text-accent"
                      : "text-text-muted hover:text-text hover:bg-surface-2")
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
