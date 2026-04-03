"use client";

import { startTransition, useCallback, useEffect, useState } from "react";

import { ChevronDown, ChevronRight, History, Trash2 } from "lucide-react";

import { clearToolHistory, getToolHistory, type ToolHistoryRecord } from "@/lib/db/client";
import { formatRelativeTimeZh } from "@/lib/format-relative-time";

const HISTORY_EVENT = "dev-ease-tool-history";

type ToolHistoryPanelProps = {
  toolId: string;
};

export function ToolHistoryPanel({ toolId }: ToolHistoryPanelProps) {
  const [items, setItems] = useState<ToolHistoryRecord[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    const data = await getToolHistory(toolId, 30);
    startTransition(() => {
      setItems(data);
    });
  }, [toolId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const data = await getToolHistory(toolId, 30);
      if (!cancelled) {
        startTransition(() => {
          setItems(data);
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toolId]);

  useEffect(() => {
    const onEvt = (e: Event) => {
      const detail = (e as CustomEvent<{ toolId?: string }>).detail;
      if (detail?.toolId === toolId) {
        void load();
      }
    };
    window.addEventListener(HISTORY_EVENT, onEvt);
    return () => window.removeEventListener(HISTORY_EVENT, onEvt);
  }, [load, toolId]);

  const onClear = async () => {
    if (!window.confirm("确定清空本工具在本机的全部操作历史？此操作不可恢复。")) {
      return;
    }
    await clearToolHistory(toolId);
    await load();
  };

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5 shadow-sm shadow-black/5 backdrop-blur-md dark:shadow-black/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
            <History aria-hidden className="h-4 w-4 text-[var(--accent-violet)]" />
            操作历史
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            仅保存在本机 IndexedDB，单工具最多 {50} 条；清除站点数据会一并丢失。
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)]/40 px-3 py-6 text-center text-xs text-[var(--text-muted)]">
          暂无记录。进入本页、复制结果等操作会自动出现在这里。
        </p>
      ) : (
        <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto overscroll-contain pr-1" role="list">
          {items.map((row) => (
            <li key={row.id}>
              <div className="rounded-xl border border-[var(--border)]/80 bg-[var(--surface)]/60 px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text)]">{row.label}</p>
                    <p className="mt-0.5 text-[11px] tabular-nums text-[var(--text-faint)]" title={row.createdAt}>
                      {formatRelativeTimeZh(row.createdAt)} ·{" "}
                      {new Date(row.createdAt).toLocaleString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </div>
                  {row.detail ? (
                    <button
                      aria-expanded={Boolean(expanded[row.id])}
                      aria-label={expanded[row.id] ? "收起详情" : "展开详情"}
                      className="shrink-0 rounded-lg p-1 text-[var(--text-muted)] transition hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]"
                      type="button"
                      onClick={() => toggle(row.id)}
                    >
                      {expanded[row.id] ? (
                        <ChevronDown aria-hidden className="h-4 w-4" />
                      ) : (
                        <ChevronRight aria-hidden className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}
                </div>
                {row.detail && expanded[row.id] ? (
                  <pre className="mt-2 max-h-28 overflow-auto rounded-lg bg-[var(--surface-subtle)] p-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all text-[var(--text-muted)]">
                    {row.detail}
                  </pre>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:border-rose-500/35 hover:bg-rose-500/10 hover:text-rose-900 dark:hover:text-rose-100"
        type="button"
        onClick={() => void onClear()}
      >
        <Trash2 aria-hidden className="h-3.5 w-3.5" />
        清空本工具历史
      </button>
    </div>
  );
}
