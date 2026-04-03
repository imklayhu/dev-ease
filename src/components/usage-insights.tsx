"use client";

import { useEffect, useMemo, useState } from "react";

import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { BarChart3, Clock, Layers, Sparkles } from "lucide-react";

import type { ThemeMode } from "@/lib/db/client";
import { getAllToolActivities, getThemeSetting, isIndexedDbAvailable } from "@/lib/db/client";
import {
  computeCategoryUsageRows,
  computeToolUsageRows,
  computeUsageSummary,
  type CategoryUsageRow,
  type ToolUsageRow,
} from "@/lib/usage-stats";

function BarRow({
  label,
  count,
  max,
  sublabel,
}: {
  label: string;
  count: number;
  max: number;
  sublabel?: string;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium text-[var(--text)]">{label}</span>
        <span className="shrink-0 tabular-nums text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text)]">{count}</span>
          {sublabel ? <span className="ml-1 text-xs">{sublabel}</span> : null}
        </span>
      </div>
      <div
        aria-label={`${label}: ${count}`}
        className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-subtle)] ring-1 ring-[var(--border)]"
        role="img"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent-violet)]/90 to-[var(--accent)]/85 motion-safe:transition-[width] motion-safe:duration-500 motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function UsageInsights() {
  const tNav = useTranslations("nav");
  const t = useTranslations("usage");
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [toolRows, setToolRows] = useState<ToolUsageRow[]>([]);
  const [categoryRows, setCategoryRows] = useState<CategoryUsageRow[]>([]);
  const [summary, setSummary] = useState(() => computeUsageSummary([]));
  const [idbOk, setIdbOk] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      setIdbOk(isIndexedDbAvailable());
      const [activities, savedTheme] = await Promise.all([getAllToolActivities(), getThemeSetting()]);

      if (!active) {
        return;
      }

      setTheme(savedTheme);
      setSummary(computeUsageSummary(activities));
      setToolRows(computeToolUsageRows(activities));
      setCategoryRows(computeCategoryUsageRows(activities));
    })();

    return () => {
      active = false;
    };
  }, []);

  const maxTool = useMemo(() => toolRows.reduce((m, r) => Math.max(m, r.count), 0), [toolRows]);
  const maxCat = useMemo(() => categoryRows.reduce((m, r) => Math.max(m, r.count), 0), [categoryRows]);
  const totalVisits = summary.totalVisits;
  const hasData = totalVisits > 0;
  const categoryWithAny = categoryRows.some((r) => r.count > 0);

  return (
    <section aria-labelledby="usage-insights-heading" className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-violet)]/25 bg-gradient-to-r from-[var(--accent-violet)]/12 to-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--text-muted)] ring-1 ring-[var(--border)]">
            <BarChart3 aria-hidden className="h-4 w-4 text-[var(--accent-violet)]" />
            {t("badge")}
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--text)]" id="usage-insights-heading">
            {t("title")}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            {t("lead")}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-xs text-[var(--text-muted)]">
          {!idbOk ? t("idbUnavailable") : t("idbEnabled")}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border-strong)] p-[1px] shadow-[var(--shadow)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-violet)]/10 via-transparent to-[var(--accent)]/10"
        />
        <div className="relative rounded-[22px] glass-panel p-6 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-3">
            <KpiCard
              icon={Layers}
              label={t("kpi.totalVisits")}
              value={hasData ? String(summary.totalVisits) : "—"}
            />
            <KpiCard
              icon={Sparkles}
              label={t("kpi.activeTools")}
              value={hasData ? String(summary.toolsWithVisits) : "—"}
            />
            <KpiCard
              icon={Clock}
              label={t("kpi.lastVisit")}
              value={
                summary.lastActivityAt
                  ? new Date(summary.lastActivityAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : t("none")
              }
            />
          </div>

          {!hasData ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)]/50 px-5 py-10 text-center">
              <p className="text-sm font-medium text-[var(--text)]">{t("emptyTitle")}</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{t("emptyDesc")}</p>
              <Link
                className="mt-5 inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/10"
                href="/#tools"
              >
                {tNav("browseTools")}
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-10">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--text)]">{t("toolVisitsTitle")}</h3>
                <div className="space-y-4">
                  {toolRows.map((row) => (
                    <BarRow key={row.toolId} count={row.count} label={row.title} max={maxTool} />
                  ))}
                </div>
              </div>

              {categoryWithAny ? (
                <div className="space-y-4 border-t border-[var(--border)] pt-8">
                  <h3 className="text-sm font-semibold text-[var(--text)]">{t("categorySummaryTitle")}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{t("categorySummaryDesc")}</p>
                  <div className="space-y-4">
                    {categoryRows
                      .filter((r) => r.count > 0)
                      .sort((a, b) => b.count - a.count)
                      .map((row) => (
                        <BarRow
                          key={row.categoryId}
                          count={row.count}
                          label={row.categoryTitle}
                          max={maxCat}
                          sublabel={
                            totalVisits > 0 ? t("percent", { value: Math.round((row.count / totalVisits) * 100) }) : undefined
                          }
                        />
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6">
            <p className="text-sm font-semibold text-[var(--text)]">{t("currentTheme")}</p>
            <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-sm font-medium text-[var(--accent)] ring-1 ring-[var(--accent)]/30">
              {t(`theme.${theme}`)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/60 p-4 ring-1 ring-white/5">
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        <Icon aria-hidden className="h-4 w-4 text-[var(--accent-violet)]" />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-[var(--text)]">{value}</p>
    </div>
  );
}
