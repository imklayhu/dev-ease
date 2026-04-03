import { Link } from "@/i18n/navigation";

import type { LucideIcon } from "lucide-react";

import { ArrowUpRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";

type ToolCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  openLabel: string;
  enterLabel: string;
  featuredLabel: string;
  /** Bento 大卡片：跨两列、更强玻璃与装饰 */
  featured?: boolean;
};

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  featured,
  openLabel,
  enterLabel,
  featuredLabel,
}: ToolCardProps) {
  return (
    <Link
      className={cn(
        "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl p-[1px] outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-300",
        "bg-gradient-to-br from-[var(--accent-violet)]/35 via-[var(--accent-fuchsia)]/20 to-[var(--accent)]/25",
        "shadow-[var(--shadow)] hover:shadow-[var(--glow)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        featured && "sm:col-span-2",
      )}
      href={href}
    >
      <span className="card-shimmer" aria-hidden />

      <div
        className={cn(
          "glass-panel relative flex min-h-0 flex-1 flex-col rounded-[22px] border border-[var(--border-strong)]/80",
          featured ? "p-6 sm:p-7" : "p-5",
        )}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 gap-4",
            featured ? "flex-col sm:flex-row sm:items-start" : "items-start",
          )}
        >
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-violet)]/20 to-[var(--accent)]/15 text-[var(--text)] ring-1 ring-[var(--border)]",
              featured ? "h-14 w-14 sm:h-16 sm:w-16" : "h-11 w-11",
            )}
          >
            <Icon aria-hidden className={featured ? "h-7 w-7 sm:h-8 sm:w-8" : "h-5 w-5"} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[15px] font-semibold leading-snug tracking-tight text-[var(--text)] sm:text-base">
                  {title}
                </h2>
                {featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-[var(--accent)] ring-1 ring-[var(--accent)]/30">
                    <Sparkles aria-hidden className="h-3 w-3" />
                    {featuredLabel}
                  </span>
                ) : null}
              </div>
              {badge ? (
                <span className="rounded-lg bg-[var(--surface-subtle)] px-2 py-1 font-mono text-[11px] font-medium text-[var(--text-muted)] ring-1 ring-[var(--border)]">
                  {badge}
                </span>
              ) : null}
            </div>
            <p
              className={cn(
                "leading-6 text-[var(--text-muted)]",
                featured ? "mt-3 max-w-2xl text-sm sm:text-[15px]" : "mt-2 text-sm",
              )}
            >
              {description}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "mt-auto flex items-center justify-between border-t border-[var(--border)] pt-4",
            featured && "pt-5",
          )}
        >
          <span className="text-sm font-medium text-[var(--text-muted)]">{openLabel}</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text)]">
            <span className="transition duration-200 group-hover:text-[var(--accent-violet)]">{enterLabel}</span>
            <ArrowUpRight
              aria-hidden
              className="h-4 w-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-violet)] motion-reduce:transform-none"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
