"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Tasks" },
  { href: "/calendar", label: "Calendar" },
  { href: "/owners", label: "Owners" },
  { href: "/tags", label: "Tags" },
] as const;

export function TopNav(): React.ReactElement {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-40">
      <nav className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3 sm:gap-6">
        <Link href="/" className="font-semibold tracking-tight text-lavender shrink-0">
          ✦ <span className="hidden sm:inline">Todo</span>
        </Link>
        <ul className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    "inline-block whitespace-nowrap min-h-11 px-3 py-2 rounded-full text-sm transition-colors " +
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
        <a
          href="/api/export"
          download
          className="text-xs text-text-muted hover:text-accent transition-colors min-h-11 px-2 flex items-center shrink-0"
          title="Download all data as JSON"
          aria-label="Export data"
        >
          ⤓<span className="hidden sm:inline ml-1">export</span>
        </a>
      </nav>
    </header>
  );
}
