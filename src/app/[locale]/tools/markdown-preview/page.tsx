"use client";

import { useMemo, useState } from "react";

import DOMPurify from "dompurify";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { marked } from "marked";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "markdown-preview";

type TocItem = { level: number; text: string };

function getToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  return lines
    .map((line) => line.match(/^(#{1,3})\s+(.+)\s*$/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => ({ level: m[1].length, text: m[2].trim() }));
}

export default function MarkdownPreviewPage() {
  const t = useTranslations("toolPages.markdownPreview");
  const defaultInput = t("demoMarkdown");
  const [input, setInput] = useState(defaultInput);
  const [tab, setTab] = useState<"preview" | "html">("preview");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const { html, toc, stats } = useMemo(() => {
    marked.setOptions({ gfm: true, breaks: true });
    const raw = marked.parse(input) as string;
    const sanitized =
      typeof window === "undefined"
        ? raw
        : DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
    const headingToc = getToc(input);
    const words = input
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return {
      html: sanitized,
      toc: headingToc,
      stats: {
        chars: input.length,
        words: input.trim() ? words : 0,
        lines: input === "" ? 0 : input.split("\n").length,
      },
    };
  }, [input]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: FileText, label: t("badge") }}
          breadcrumbLabel={t("breadcrumb")}
          description={t("description")}
          title={t("title")}
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr_320px] lg:items-start">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="md-input">
                {t("input")}
              </label>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-subtle)]"
                  type="button"
                  onClick={() => setInput(defaultInput)}
                >
                  {t("resetDemo")}
                </button>
                <button
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-subtle)]"
                  type="button"
                  onClick={() => setInput("")}
                >
                  {t("clear")}
                </button>
              </div>
            </div>
            <textarea
              className={`${TOOL_TEXTAREA_CLASS} min-h-96`}
              id="md-input"
              placeholder={t("placeholder")}
              spellCheck={false}
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
              <span>{t("stats.chars", { value: stats.chars })}</span>
              <span>·</span>
              <span>{t("stats.words", { value: stats.words })}</span>
              <span>·</span>
              <span>{t("stats.lines", { value: stats.lines })}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex rounded-xl border border-[var(--border)] p-1">
                <button
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    tab === "preview"
                      ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]"
                  }`}
                  type="button"
                  onClick={() => setTab("preview")}
                >
                  {t("preview")}
                </button>
                <button
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    tab === "html"
                      ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]"
                  }`}
                  type="button"
                  onClick={() => setTab("html")}
                >
                  {t("htmlSource")}
                </button>
              </div>
              <CopyButton
                historyDetail={html.slice(0, 120)}
                historyLabel={t("history.copyHtml")}
                label={t("copyHtml")}
                text={html}
                toolId={TOOL_ID}
              />
            </div>

            {tab === "preview" ? (
              <article
                className="prose prose-sm dark:prose-invert min-h-96 max-w-none overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-4 text-[var(--text)]"
                dangerouslySetInnerHTML={{ __html: html || `<p>${t("empty")}</p>` }}
              />
            ) : (
              <textarea className={`${TOOL_TEXTAREA_CLASS} min-h-96`} readOnly value={html} />
            )}
            <p className="text-xs text-[var(--text-muted)]">{t("tip")}</p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5">
              <p className="text-sm font-semibold text-[var(--text)]">{t("toc")}</p>
              {toc.length === 0 ? (
                <p className="mt-2 text-sm text-[var(--text-muted)]">{t("tocEmpty")}</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {toc.map((item, index) => (
                    <li
                      key={`${item.text}-${index}`}
                      className="text-sm text-[var(--text-muted)]"
                      style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                    >
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
            <ToolHistoryPanel toolId={TOOL_ID} />
          </aside>
        </section>
      </main>
    </div>
  );
}
