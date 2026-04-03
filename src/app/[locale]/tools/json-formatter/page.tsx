"use client";

import { useMemo, useState } from "react";

import { Braces } from "lucide-react";
import { useTranslations } from "next-intl";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";

const TOOL_ID = "json-formatter";

const TEXTAREA_CLASS =
  "min-h-56 w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-4 text-sm leading-6 text-[var(--text)] shadow-sm shadow-black/5 outline-none ring-offset-2 ring-offset-[var(--surface)] transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)] dark:shadow-black/40 font-mono";

export default function JsonFormatterPage() {
  const t = useTranslations("toolPages.jsonFormatter");
  const [input, setInput] = useState("");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const parsed = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { ok: true as const, value: null as unknown, error: "" };
    }

    try {
      return { ok: true as const, value: JSON.parse(trimmed) as unknown, error: "" };
    } catch (error) {
      const message = error instanceof Error ? error.message : t("unknownError");
      return { ok: false as const, value: null as unknown, error: message };
    }
  }, [input, t]);

  const output = parsed.ok && parsed.value !== null ? JSON.stringify(parsed.value, null, 2) : "";
  const minified = parsed.ok && parsed.value !== null ? JSON.stringify(parsed.value) : "";
  const error = parsed.ok ? "" : parsed.error;

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: Braces, label: "JSON · 校验与排版" }}
          breadcrumbLabel="JSON 工具"
          description="在浏览器内解析 JSON：支持格式化（缩进）与压缩。错误信息来自原生 JSON.parse。"
          title="JSON 格式化 / 压缩"
        />

        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="json-input">
                {t("inputLabel")}
              </label>
              <textarea
                className={TEXTAREA_CLASS}
                id="json-input"
                placeholder={t("placeholder")}
                spellCheck={false}
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-900 dark:text-red-100">
                {t("parseFailed")}: {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <CopyButton
                historyDetail={output ? output.slice(0, 120) : undefined}
                historyLabel={t("history.copyFormatted")}
                label={t("copyFormatted")}
                text={output}
                toolId={TOOL_ID}
              />
              <CopyButton
                historyDetail={minified ? minified.slice(0, 120) : undefined}
                historyLabel={t("history.copyMinified")}
                label={t("copyMinified")}
                text={minified}
                toolId={TOOL_ID}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--text)]">{t("formattedTitle")}</p>
                <textarea className={`${TEXTAREA_CLASS} min-h-40`} readOnly value={output} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--text)]">{t("minifiedTitle")}</p>
                <textarea className={`${TEXTAREA_CLASS} min-h-40`} readOnly value={minified} />
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              {t("tip")}
            </p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5 shadow-sm shadow-black/5 backdrop-blur-md dark:shadow-black/40">
              <p className="text-sm font-semibold text-[var(--text)]">{t("usageTitle")}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--text-muted)]">
                <li>{t("usageLi1")}</li>
                <li>{t("usageLi2")}</li>
              </ul>
            </div>
            <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
            <ToolHistoryPanel toolId={TOOL_ID} />
          </aside>
        </section>
      </main>
    </div>
  );
}
