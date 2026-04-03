import Link from "next/link";

import type { ReactNode } from "react";

import { SITE_REPOSITORY_URL } from "@/lib/brand";

type SiteInfoProps = {
  /**
   * `default`：完整关于页用的玻璃卡片。
   * `inline`：侧栏抽屉用——无二次卡片壳，信息分层 + 分隔线（减少「卡片套卡片」）。
   */
  variant?: "default" | "inline";
};

const rows: Array<{ label: string; value: ReactNode }> = [
  { label: "框架", value: "Next.js（静态导出）" },
  { label: "部署", value: "GitHub Pages" },
  { label: "存储", value: "IndexedDB" },
  { label: "后端", value: "无" },
  {
    label: "源码",
    value: (
      <Link
        className="text-[var(--accent-violet)] underline-offset-4 transition hover:text-[var(--text)] hover:underline"
        href={SITE_REPOSITORY_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        GitHub · imklayhu/dev-ease
      </Link>
    ),
  },
];

export function SiteInfo({ variant = "default" }: SiteInfoProps) {
  if (variant === "inline") {
    return (
      <div className="space-y-3">
        <h3
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]"
          id="site-meta-heading"
        >
          技术栈
        </h3>
        <dl className="divide-y divide-[var(--border)]/90">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0 sm:gap-8"
            >
              <dt className="shrink-0 text-[13px] text-[var(--text-faint)]">{row.label}</dt>
              <dd className="min-w-0 text-right text-[13px] font-medium leading-snug text-[var(--text)]">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="pt-1 font-mono text-[11px] text-[var(--text-faint)]">版本 v0.x</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border-strong)] p-[1px] shadow-[var(--shadow)]">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-violet)]/12 via-transparent to-[var(--accent)]/10" />
      <div className="relative flex flex-col rounded-[31px] glass-panel">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
          <p className="text-sm font-semibold text-[var(--text)]">站点信息</p>
          <p className="rounded-full bg-[var(--surface-subtle)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--text-faint)] ring-1 ring-[var(--border)]">
            v0.x
          </p>
        </div>

        <dl className="flex flex-1 flex-col justify-center space-y-4 px-6 py-6 font-mono text-[13px] leading-6 text-[var(--text-muted)]">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4">
              <dt className="text-[var(--text-faint)]">{row.label}</dt>
              <dd className="text-right text-[var(--text)]">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
