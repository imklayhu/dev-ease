"use client";

import { useMemo, useState } from "react";

import type { LucideIcon } from "lucide-react";
import { AlignLeft, Hash, ListOrdered, WholeWord } from "lucide-react";

import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";

const TOOL_ID = "text-counter";

const countWords = (text: string): number => {
  const normalized = text.trim();
  if (!normalized) {
    return 0;
  }

  return normalized.split(/\s+/).length;
};

export default function TextCounterPage() {
  const [content, setContent] = useState("");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const stats = useMemo(() => {
    const chars = content.length;
    const words = countWords(content);
    const lines = content ? content.split(/\r?\n/).length : 0;

    return { chars, words, lines };
  }, [content]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: Hash, label: "文本分析 · 本地统计" }}
          breadcrumbLabel="文本计数器"
          description="适合写作校对、内容检查与快速估算篇幅。访问次数会记录在本地 IndexedDB（不上传服务器）。"
          title="文本计数器"
        />

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[var(--text)]" htmlFor="text-input">
              输入文本
            </label>
            <textarea
              className="min-h-64 w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-4 text-sm leading-6 text-[var(--text)] shadow-sm shadow-black/5 outline-none ring-offset-2 ring-offset-[var(--surface)] transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)] dark:shadow-black/40"
              id="text-input"
              placeholder="粘贴或输入文本…"
              spellCheck={false}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <p className="text-xs text-[var(--text-muted)]">提示：统计规则为「空白分隔的单词」；中英文混合时以空格分词为准。</p>
          </div>

          <aside className="space-y-4">
            <div className="grid gap-3">
              <StatItem icon={AlignLeft} label="字符数" value={stats.chars} />
              <StatItem icon={WholeWord} label="单词数" value={stats.words} />
              <StatItem icon={ListOrdered} label="行数" value={stats.lines} />
            </div>

            <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
            <ToolHistoryPanel toolId={TOOL_ID} />
          </aside>
        </section>
      </main>
    </div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-4 shadow-sm shadow-black/5 dark:shadow-black/40">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] ring-1 ring-[var(--accent)]/25">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-[var(--text-muted)]">{label}</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums tracking-tight text-[var(--text)]">{value}</p>
        </div>
      </div>
    </div>
  );
}
