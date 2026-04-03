"use client";

import { useMemo, useState } from "react";

import { Fingerprint } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { appendToolHistory } from "@/lib/db/client";

const TOOL_ID = "uuid";

export default function UuidPage() {
  const [count, setCount] = useState(5);
  const [items, setItems] = useState<string[]>([]);
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const allText = useMemo(() => items.join("\n"), [items]);

  const generate = () => {
    const n = Number.isFinite(count) ? Math.floor(count) : 1;
    const safeCount = Math.min(50, Math.max(1, n));
    const next = Array.from({ length: safeCount }, () => crypto.randomUUID());
    setItems(next);
    void appendToolHistory({ toolId: TOOL_ID, label: `生成 ${safeCount} 条 UUID` });
  };

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: Fingerprint, label: "UUID · v4" }}
          breadcrumbLabel="UUID"
          description="使用 Web Crypto 的随机 UUID（v4）。批量生成适合本地填充测试数据。"
          title="UUID 生成器"
        />

        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text)]" htmlFor="uuid-count">
                  生成数量
                </label>
                <input
                  className="w-32 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-4 py-3 text-sm text-[var(--text)] shadow-sm outline-none ring-offset-2 ring-offset-[var(--surface)] transition focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)]"
                  id="uuid-count"
                  max={50}
                  min={1}
                  type="number"
                  value={count}
                  onChange={(event) => setCount(Number(event.target.value))}
                />
              </div>

              <button
                className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)] shadow-sm outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                type="button"
                onClick={generate}
              >
                生成
              </button>

              <CopyButton
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 px-3 py-3 text-sm font-semibold text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10"
                historyDetail={allText ? allText.slice(0, 120) : undefined}
                historyLabel="复制全部 UUID"
                label="复制全部"
                text={allText}
                toolId={TOOL_ID}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--text)]">结果</p>
              {items.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">点击「生成」开始。</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((id) => (
                    <li
                      key={id}
                      className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <code className="break-all font-mono text-sm text-[var(--text)]">{id}</code>
                      <CopyButton
                        historyDetail={id}
                        historyLabel="复制单条 UUID"
                        text={id}
                        toolId={TOOL_ID}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-xs text-[var(--text-muted)]">提示：单次最多生成 50 条，避免页面卡顿。</p>
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
