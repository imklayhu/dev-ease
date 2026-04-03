import Link from "next/link";

import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";

type ToolPageHeaderProps = {
  title: string;
  description: string;
  breadcrumbLabel: string;
  backHref?: string;
  badge?: { icon: LucideIcon; label: string };
};

export function ToolPageHeader({
  title,
  description,
  breadcrumbLabel,
  backHref = "/#tools",
  badge,
}: ToolPageHeaderProps) {
  const BadgeIcon = badge?.icon;

  return (
    <>
      <nav aria-label="面包屑导航" className="text-sm text-[var(--text-muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              className="cursor-pointer rounded-md font-medium text-[var(--accent-violet)] underline-offset-4 transition hover:text-[var(--text)] hover:underline"
              href="/"
            >
              首页
            </Link>
          </li>
          <li aria-hidden className="text-[var(--text-muted)]/70">
            /
          </li>
          <li className="text-[var(--text)]">{breadcrumbLabel}</li>
        </ol>
      </nav>

      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          {badge && BadgeIcon ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-violet)]/25 bg-gradient-to-r from-[var(--accent-violet)]/12 to-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--text-muted)] ring-1 ring-[var(--border)]">
              <BadgeIcon aria-hidden className="h-4 w-4 text-[var(--accent-violet)]" />
              {badge.label}
            </div>
          ) : null}

          <div className="space-y-2">
            <h1 className="font-display text-balance text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-7 text-[var(--text-muted)] sm:text-base">{description}</p>
          </div>
        </div>

        <Link
          className="inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 px-4 py-2.5 text-sm font-semibold text-[var(--text)] shadow-[var(--shadow)] outline-none ring-offset-2 ring-offset-[var(--surface)] backdrop-blur-sm transition duration-200 hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/10 focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          href={backHref}
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          返回工具
        </Link>
      </header>
    </>
  );
}
