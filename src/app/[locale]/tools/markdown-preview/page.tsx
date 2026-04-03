"use client";

import { useMemo, useState } from "react";

import DOMPurify from "dompurify";
import { AlignLeft, BookOpen, Columns2, Eye, Maximize2, PenLine } from "lucide-react";
import { useTranslations } from "next-intl";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { cn } from "@/lib/cn";
import { renderMarkdownToHtml } from "@/lib/markdown-render";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "markdown-preview";

type ViewMode = "split" | "editor" | "preview";
type ReadingWidth = "comfort" | "wide";
type OutputTab = "preview" | "html";

function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html;
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["id", "data-language"],
  });
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

function scheduleScrollToHeading(id: string) {
  window.setTimeout(() => scrollToHeading(id), 120);
}

export default function MarkdownPreviewPage() {
  const t = useTranslations("toolPages.markdownPreview");
  const defaultInput = t("demoMarkdown");
  const [input, setInput] = useState(defaultInput);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [readingWidth, setReadingWidth] = useState<ReadingWidth>("comfort");
  const [outputTab, setOutputTab] = useState<OutputTab>("preview");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const { html: rawHtml, toc, stats } = useMemo(() => {
    const { html, toc: headingToc } = renderMarkdownToHtml(input);
    const words = input
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return {
      html,
      toc: headingToc,
      stats: {
        chars: input.length,
        words: input.trim() ? words : 0,
        lines: input === "" ? 0 : input.split("\n").length,
      },
    };
  }, [input]);

  const html = useMemo(() => sanitizeHtml(rawHtml), [rawHtml]);

  const showEditor = viewMode !== "preview";
  const showPreviewPane = viewMode !== "editor";

  function handleTocNavigate(id: string) {
    if (!showPreviewPane) {
      setViewMode("split");
      scheduleScrollToHeading(id);
      return;
    }
    scrollToHeading(id);
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: BookOpen, label: t("badge") }}
          breadcrumbLabel={t("breadcrumb")}
          description={t("description")}
          title={t("title")}
        />

        {/* 工具栏：视图模式 + 阅读宽度（预览可见时） */}
        <div className="glass-panel flex flex-col gap-4 rounded-2xl border border-[var(--border)] p-4 shadow-[var(--shadow)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              {t("toolbar.view")}
            </span>
            <div className="inline-flex rounded-xl border border-[var(--border)] p-1">
              <button
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  viewMode === "split"
                    ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]",
                )}
                type="button"
                onClick={() => setViewMode("split")}
              >
                <Columns2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("viewMode.split")}
              </button>
              <button
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  viewMode === "editor"
                    ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]",
                )}
                type="button"
                onClick={() => setViewMode("editor")}
              >
                <PenLine className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("viewMode.editor")}
              </button>
              <button
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  viewMode === "preview"
                    ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]",
                )}
                type="button"
                onClick={() => setViewMode("preview")}
              >
                <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("viewMode.preview")}
              </button>
            </div>
          </div>

          {showPreviewPane ? (
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {t("toolbar.reading")}
              </span>
              <div className="inline-flex rounded-xl border border-[var(--border)] p-1">
                <button
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    readingWidth === "comfort"
                      ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]",
                  )}
                  type="button"
                  onClick={() => setReadingWidth("comfort")}
                >
                  <AlignLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {t("readingWidth.comfort")}
                </button>
                <button
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    readingWidth === "wide"
                      ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]",
                  )}
                  type="button"
                  onClick={() => setReadingWidth("wide")}
                >
                  <Maximize2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {t("readingWidth.wide")}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <section
          className={cn(
            "grid gap-6",
            viewMode === "split" && "lg:grid-cols-2 xl:grid-cols-[1fr_1fr_minmax(220px,280px)]",
            viewMode === "editor" && "max-w-3xl",
            viewMode === "preview" && "max-w-4xl",
            (viewMode === "editor" || viewMode === "preview") && "mx-auto w-full",
          )}
        >
          {showEditor ? (
            <div className="flex min-h-0 flex-col gap-3 lg:min-h-[28rem]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-semibold text-[var(--text)]" htmlFor="md-input">
                  {t("input")}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    className="cursor-pointer rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-subtle)]"
                    type="button"
                    onClick={() => setInput(defaultInput)}
                  >
                    {t("resetDemo")}
                  </button>
                  <button
                    className="cursor-pointer rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-subtle)]"
                    type="button"
                    onClick={() => setInput("")}
                  >
                    {t("clear")}
                  </button>
                </div>
              </div>
              <textarea
                className={cn(TOOL_TEXTAREA_CLASS, "min-h-[22rem] flex-1 lg:min-h-[min(70vh,36rem)]")}
                id="md-input"
                placeholder={t("placeholder")}
                spellCheck={false}
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)] tabular-nums">
                <span>{t("stats.chars", { value: stats.chars })}</span>
                <span aria-hidden>·</span>
                <span>{t("stats.words", { value: stats.words })}</span>
                <span aria-hidden>·</span>
                <span>{t("stats.lines", { value: stats.lines })}</span>
              </div>
            </div>
          ) : null}

          {showPreviewPane ? (
            <div className="flex min-h-0 flex-col gap-3 lg:min-h-[28rem]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex rounded-xl border border-[var(--border)] p-1">
                  <button
                    className={cn(
                      "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      outputTab === "preview"
                        ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]",
                    )}
                    type="button"
                    onClick={() => setOutputTab("preview")}
                  >
                    {t("preview")}
                  </button>
                  <button
                    className={cn(
                      "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      outputTab === "html"
                        ? "bg-[var(--accent-violet)]/20 text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]",
                    )}
                    type="button"
                    onClick={() => setOutputTab("html")}
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

              {outputTab === "preview" ? (
                <article
                  aria-label={t("previewAria")}
                  className="glass-panel flex min-h-[22rem] flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border)] shadow-[var(--shadow)] lg:min-h-[min(70vh,36rem)]"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
                      <Eye className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                      {t("previewPanelLabel")}
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto px-4 py-4">
                    <div
                      suppressHydrationWarning
                      className={cn(
                        "devease-md",
                        readingWidth === "comfort" && "devease-md--comfort",
                      )}
                      dangerouslySetInnerHTML={{
                        __html: html || `<p class="text-[var(--text-muted)]">${t("empty")}</p>`,
                      }}
                    />
                  </div>
                </article>
              ) : (
                <textarea
                  className={cn(TOOL_TEXTAREA_CLASS, "min-h-[22rem] flex-1 lg:min-h-[min(70vh,36rem)]")}
                  readOnly
                  spellCheck={false}
                  value={html}
                />
              )}
              <p className="text-xs leading-relaxed text-[var(--text-muted)]">{t("tip")}</p>
            </div>
          ) : null}

          <aside
            className={cn(
              "flex flex-col gap-4",
              viewMode === "split" && "lg:col-span-2 xl:col-span-1 xl:col-start-3 xl:row-start-1",
            )}
          >
            <div className="glass-panel rounded-2xl border border-[var(--border)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm font-semibold text-[var(--text)]">{t("toc")}</p>
              {toc.length === 0 ? (
                <p className="mt-2 text-sm text-[var(--text-muted)]">{t("tocEmpty")}</p>
              ) : (
                <nav aria-label={t("toc")}>
                  <ul className="mt-3 max-h-72 space-y-1 overflow-y-auto pr-1 xl:max-h-[min(60vh,28rem)]">
                    {toc.map((item, index) => (
                      <li key={`${item.id}-${index}`}>
                        <button
                          className={cn(
                            "w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]",
                          )}
                          style={{ paddingLeft: `${8 + (item.level - 1) * 12}px` }}
                          type="button"
                          onClick={() => handleTocNavigate(item.id)}
                        >
                          <span className="line-clamp-2">{item.text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
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
