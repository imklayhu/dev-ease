import Link from "next/link";

import { BRAND_DISPLAY_NAME } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--border-strong)] bg-[var(--surface)]/80 py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-violet)]/45 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[min(90%,42rem)] -translate-x-1/2 rounded-full bg-[var(--accent-violet)]/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md leading-7">
          © {new Date().getFullYear()} {BRAND_DISPLAY_NAME} · 偏好与访问记录默认保存在浏览器本地
        </p>
        <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:gap-6 sm:text-right">
          <Link
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 font-medium text-[var(--text-muted)] transition hover:border-[var(--accent-violet)]/40 hover:text-[var(--text)]"
            href="/settings/"
          >
            关于我们
          </Link>
          <p className="font-mono text-[var(--text-faint)]">Next.js · Tailwind · GitHub Pages</p>
        </div>
      </div>
    </footer>
  );
}
