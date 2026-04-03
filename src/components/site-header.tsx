import type { ReactNode } from "react";

import Link from "next/link";

import { Wrench } from "lucide-react";

import { AboutDrawer } from "@/components/about-drawer";
import { BRAND_DISPLAY_NAME, BRAND_TAGLINE } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="sticky top-4 z-50 w-full px-6">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 overflow-hidden rounded-[1.75rem] p-[1px] shadow-[var(--shadow)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--accent-violet)]/35 via-[var(--accent-fuchsia)]/15 to-[var(--accent)]/30 opacity-90"
        />
        <div className="relative flex w-full items-center justify-between gap-4 rounded-[22px] border border-[var(--border-strong)]/90 glass-panel px-4 py-3 backdrop-blur-xl sm:px-5">
          <Link
            className="group flex cursor-pointer items-center gap-3 rounded-xl outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            href="/"
          >
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent-violet)]/25 to-[var(--accent)]/20 text-[var(--text)] ring-1 ring-[var(--border)]">
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--accent-cyan) 35%, transparent), transparent 55%)",
                }}
              />
              <Wrench aria-hidden className="relative h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold tracking-tight text-[var(--text)]">{BRAND_DISPLAY_NAME}</span>
              <span className="text-xs text-[var(--text-muted)]">{BRAND_TAGLINE}</span>
            </span>
          </Link>

          <nav aria-label="主导航" className="flex items-center gap-1 sm:gap-2">
            <HeaderNavLink href="/">首页</HeaderNavLink>
            <HeaderNavLink href="/#tools">工具</HeaderNavLink>
            <AboutDrawer />
          </nav>
        </div>
      </div>
    </header>
  );
}

function HeaderNavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-muted)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 hover:bg-[var(--accent-violet)]/10 hover:text-[var(--text)] hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-violet)_35%,transparent)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      href={href}
    >
      {children}
    </Link>
  );
}
