"use client";

import { useMemo, useState } from "react";

import { format } from "sql-formatter";
import { Database } from "lucide-react";
import { useTranslations } from "next-intl";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { cn } from "@/lib/cn";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "sql-formatter";

type SqlDialect = "sql" | "mysql" | "postgresql" | "sqlite" | "bigquery" | "transactsql";

const DIALECTS: SqlDialect[] = ["sql", "mysql", "postgresql", "sqlite", "bigquery", "transactsql"];

export default function SqlFormatterPage() {
  const t = useTranslations("toolPages.sqlFormatter");
  const [input, setInput] = useState(
    'SELECT id,name FROM users WHERE active=1 ORDER BY id DESC LIMIT 10;',
  );
  const [dialect, setDialect] = useState<SqlDialect>("mysql");
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower">("upper");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const formatted = useMemo(() => {
    const raw = input.trim();
    if (!raw) return { ok: true as const, text: "" };
    try {
      const text = format(raw, {
        language: dialect,
        tabWidth: 2,
        keywordCase,
      });
      return { ok: true as const, text };
    } catch (e) {
      return {
        ok: false as const,
        message: e instanceof Error ? e.message : String(e),
      };
    }
  }, [input, dialect, keywordCase]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: Database, label: t("badge") }}
          breadcrumbLabel={t("breadcrumb")}
          description={t("description")}
          title={t("title")}
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[var(--text)]" htmlFor="sql-dialect">
                  {t("dialect")}
                </label>
                <select
                  className={cn(
                    "cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-3 py-2 text-sm text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)]",
                  )}
                  id="sql-dialect"
                  value={dialect}
                  onChange={(e) => setDialect(e.target.value as SqlDialect)}
                >
                  {DIALECTS.map((d) => (
                    <option key={d} value={d}>
                      {t(`dialects.${d}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="inline-flex rounded-xl border border-[var(--border)] p-1">
                <button
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    keywordCase === "upper"
                      ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]",
                  )}
                  type="button"
                  onClick={() => setKeywordCase("upper")}
                >
                  {t("keywordUpper")}
                </button>
                <button
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    keywordCase === "lower"
                      ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]",
                  )}
                  type="button"
                  onClick={() => setKeywordCase("lower")}
                >
                  {t("keywordLower")}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="sql-input">
                {t("input")}
              </label>
              <textarea
                className={`${TOOL_TEXTAREA_CLASS} min-h-40`}
                id="sql-input"
                placeholder={t("placeholder")}
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {!formatted.ok ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-900 dark:text-red-100">
                {t("formatError", { detail: formatted.message })}
              </div>
            ) : null}

            {formatted.ok ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-[var(--text)]" htmlFor="sql-output">
                    {t("output")}
                  </label>
                  <CopyButton
                    historyDetail={formatted.text.slice(0, 120)}
                    historyLabel={t("history.copyFormatted")}
                    label={t("copyFormatted")}
                    text={formatted.text}
                    toolId={TOOL_ID}
                  />
                </div>
                <textarea
                  className={`${TOOL_TEXTAREA_CLASS} min-h-64`}
                  id="sql-output"
                  readOnly
                  spellCheck={false}
                  value={formatted.text}
                />
              </div>
            ) : null}

            <p className="text-xs leading-relaxed text-[var(--text-muted)]">{t("tip")}</p>
          </div>

          <aside className="space-y-4">
            <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
            <ToolHistoryPanel toolId={TOOL_ID} />
          </aside>
        </section>
      </main>
    </div>
  );
}
