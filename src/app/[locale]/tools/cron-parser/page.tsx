"use client";

import { useMemo, useState } from "react";

import { CalendarClock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { getNextCronRuns } from "@/lib/cron-next-runs";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "cron-parser";

export default function CronParserPage() {
  const t = useTranslations("toolPages.cronParser");
  const locale = useLocale();
  const [input, setInput] = useState("0 9 * * 1-5");
  const [count, setCount] = useState(8);
  const [timeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const localeTag =
    locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : "en-US";

  const result = useMemo(() => getNextCronRuns(input, count, timeZone), [input, count, timeZone]);

  const copyText = useMemo(() => {
    if (!result.ok || result.dates.length === 0) return "";
    const fmt = new Intl.DateTimeFormat(localeTag, {
      dateStyle: "medium",
      timeStyle: "medium",
      timeZone,
    });
    return result.dates.map((d, i) => `${i + 1}. ${fmt.format(d)}`).join("\n");
  }, [result, localeTag, timeZone]);

  const errorText =
    result.ok || result.message === "empty"
      ? ""
      : result.message === "badCount"
        ? t("badCount")
        : t("parseError", { detail: result.message });

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: CalendarClock, label: t("badge") }}
          breadcrumbLabel={t("breadcrumb")}
          description={t("description")}
          title={t("title")}
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="cron-input">
                {t("input")}
              </label>
              <textarea
                className={`${TOOL_TEXTAREA_CLASS} min-h-24 font-mono text-sm`}
                id="cron-input"
                placeholder={t("placeholder")}
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[var(--text)]" htmlFor="cron-count">
                  {t("nextCount")}
                </label>
                <input
                  className="w-24 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-3 py-2 text-sm text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)]"
                  id="cron-count"
                  inputMode="numeric"
                  max={50}
                  min={1}
                  type="number"
                  value={count}
                  onChange={(e) => {
                    const n = Number.parseInt(e.target.value, 10);
                    if (Number.isNaN(n)) setCount(1);
                    else setCount(Math.min(50, Math.max(1, n)));
                  }}
                />
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                <p>
                  <span className="font-semibold text-[var(--text)]">{t("timezone")}</span> {timeZone}
                </p>
              </div>
            </div>

            {errorText ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-900 dark:text-red-100">
                {errorText}
              </div>
            ) : null}

            {result.ok && result.dates.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--text)]">{t("nextRuns")}</p>
                  <CopyButton
                    historyDetail={copyText.slice(0, 120)}
                    historyLabel={t("history.copyRuns")}
                    label={t("copyRuns")}
                    text={copyText}
                    toolId={TOOL_ID}
                  />
                </div>
                <ol
                  className="list-decimal space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 py-4 pl-8 pr-4 font-mono text-sm text-[var(--text)]"
                  id="cron-next-runs"
                >
                  {result.dates.map((d, i) => (
                    <li key={`${d.getTime()}-${i}`}>
                      {new Intl.DateTimeFormat(localeTag, {
                        dateStyle: "medium",
                        timeStyle: "medium",
                        timeZone,
                      }).format(d)}
                    </li>
                  ))}
                </ol>
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
