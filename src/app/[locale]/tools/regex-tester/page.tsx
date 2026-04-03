"use client";

import { useMemo, useState } from "react";

import { Regex } from "lucide-react";
import { useTranslations } from "next-intl";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";

const TOOL_ID = "regex-tester";

const MAX_LEN = 200_000;

const TEXTAREA_CLASS =
  "min-h-40 w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-4 text-sm leading-6 text-[var(--text)] shadow-sm shadow-black/5 outline-none ring-offset-2 ring-offset-[var(--surface)] transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)] dark:shadow-black/40 font-mono";

type MatchItem = {
  index: number;
  text: string;
  groups: string[];
};

export default function RegexTesterPage() {
  const t = useTranslations("toolPages.regexTester");
  const [pattern, setPattern] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [haystack, setHaystack] = useState("hello DevEase 123");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const result = useMemo(() => {
    if (haystack.length > MAX_LEN) {
      return { error: t("tooLong", { max: MAX_LEN.toLocaleString() }) };
    }

    try {
      const re = new RegExp(pattern, flags);
      const items: MatchItem[] = [];

      if (re.global) {
        let match: RegExpExecArray | null;
        const cloned = new RegExp(re.source, re.flags);
        while ((match = cloned.exec(haystack)) !== null) {
          items.push({
            index: match.index,
            text: match[0],
            groups: match.slice(1),
          });

          if (match[0].length === 0) {
            cloned.lastIndex += 1;
          }

          if (items.length > 500) {
            items.push({
              index: -1,
              text: t("truncated"),
              groups: [],
            });
            break;
          }
        }

        return { items };
      }

      const m = re.exec(haystack);
      if (!m) {
        return { items: [] as MatchItem[] };
      }

      return {
        items: [
          {
            index: m.index,
            text: m[0],
            groups: m.slice(1),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : t("invalidRegex");
      return { error: message };
    }
  }, [flags, haystack, pattern, t]);

  const items: MatchItem[] = "items" in result && Array.isArray(result.items) ? result.items : [];
  const error = "error" in result ? result.error : "";
  const copyText = items
    .filter((m) => m.index >= 0)
    .map((m, i) => `${i + 1}. [${m.index}] ${m.text}`)
    .join("\n");

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: Regex, label: "RegExp · 本地执行" }}
          breadcrumbLabel="正则测试"
          description="在浏览器内构造 RegExp 并匹配文本。为降低风险，限制文本长度并对匹配数量做截断。"
          title="正则测试"
        />

        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text)]" htmlFor="re-pattern">
                  {t("pattern")}
                </label>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-4 py-3 text-sm font-mono text-[var(--text)] shadow-sm outline-none ring-offset-2 ring-offset-[var(--surface)] transition focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)]"
                  id="re-pattern"
                  spellCheck={false}
                  value={pattern}
                  onChange={(event) => setPattern(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text)]" htmlFor="re-flags">
                  {t("flags")}
                </label>
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-4 py-3 text-sm font-mono text-[var(--text)] shadow-sm outline-none ring-offset-2 ring-offset-[var(--surface)] transition focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)]"
                  id="re-flags"
                  spellCheck={false}
                  value={flags}
                  onChange={(event) => setFlags(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="re-text">
                {t("text")}
              </label>
              <textarea
                className={`${TEXTAREA_CLASS} min-h-56`}
                id="re-text"
                spellCheck={false}
                value={haystack}
                onChange={(event) => setHaystack(event.target.value)}
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-900 dark:text-red-100">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[var(--text-muted)]">
                {t("matchCount")}：<span className="font-semibold text-[var(--text)]">{items.filter((m) => m.index >= 0).length}</span>
              </p>
              <CopyButton
                historyDetail={copyText ? copyText.slice(0, 120) : undefined}
                historyLabel={t("history.copyMatches")}
                label={t("copyMatches")}
                text={copyText}
                toolId={TOOL_ID}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--text)]">{t("resultTitle")}</p>
              {items.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">{t("noMatch")}</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((m, idx) => (
                    <li
                      key={`${m.index}-${idx}`}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-4 text-sm shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[var(--text-muted)]">#{idx + 1}</span>
                        {m.index >= 0 ? (
                          <span className="font-mono text-xs text-[var(--text-muted)]">{t("index")}: {m.index}</span>
                        ) : null}
                      </div>
                      <div className="mt-2 break-all font-mono text-[var(--text)]">{m.text}</div>
                      {m.groups.length > 0 ? (
                        <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
                          <p className="font-semibold text-[var(--text)]">{t("captureGroups")}</p>
                          <ul className="list-disc pl-5">
                            {m.groups.map((g, i) => (
                              <li key={`${idx}-g-${i}`} className="break-all font-mono">
                                {i + 1}: {g || t("emptyGroup")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              {t("tipPrefix")} <code className="font-mono">g</code> {t("tipSuffix")}
            </p>
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
