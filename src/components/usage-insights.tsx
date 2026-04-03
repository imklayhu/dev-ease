"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import type { LucideIcon } from "lucide-react";
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

const THEME_LABEL: Record<ThemeMode, string> = {
  light: "亮色",
  dark: "暗色",
  system: "跟随系统",
};

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
        aria-label={`${label}：${count} 次`}
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
            本地统计
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--text)]" id="usage-insights-heading">
            使用习惯与行为概览
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            基于各工具页的访问次数汇总；主题显示为当前偏好。数据仅存本机，清除站点数据后会重置。
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-xs text-[var(--text-muted)]">
          {!idbOk ? "当前环境无 IndexedDB，统计可能仅反映本会话。" : "IndexedDB 已启用"}
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
              label="累计访问"
              value={hasData ? String(summary.totalVisits) : "—"}
            />
            <KpiCard
              icon={Sparkles}
              label="活跃工具数"
              value={hasData ? String(summary.toolsWithVisits) : "—"}
            />
            <KpiCard
              icon={Clock}
              label="最近访问"
              value={
                summary.lastActivityAt
                  ? new Date(summary.lastActivityAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "暂无"
              }
            />
          </div>

          {!hasData ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)]/50 px-5 py-10 text-center">
              <p className="text-sm font-medium text-[var(--text)]">还没有本地访问记录</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">打开任意工具页后，这里会汇总访问次数与分类占比。</p>
              <Link
                className="mt-5 inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/10"
                href="/#tools"
              >
                浏览工具
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-10">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--text)]">各工具访问次数</h3>
                <div className="space-y-4">
                  {toolRows.map((row) => (
                    <BarRow key={row.toolId} count={row.count} label={row.title} max={maxTool} />
                  ))}
                </div>
              </div>

              {categoryWithAny ? (
                <div className="space-y-4 border-t border-[var(--border)] pt-8">
                  <h3 className="text-sm font-semibold text-[var(--text)]">按用途分类汇总</h3>
                  <p className="text-xs text-[var(--text-muted)]">将各工具访问次数按其首页分类加总。</p>
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
                            totalVisits > 0 ? `（${Math.round((row.count / totalVisits) * 100)}%）` : undefined
                          }
                        />
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6">
            <p className="text-sm font-semibold text-[var(--text)]">当前主题偏好</p>
            <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-sm font-medium text-[var(--accent)] ring-1 ring-[var(--accent)]/30">
              {THEME_LABEL[theme]}
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
