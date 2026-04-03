"use client";

import { useMemo, useState } from "react";

import { Clock } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";

const TOOL_ID = "timestamp";

type Unit = "auto" | "s" | "ms";

function parseToMs(value: string, unit: Unit): { ms: number | null; error: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ms: null, error: "" };
  }

  const n = Number(trimmed);
  if (!Number.isFinite(n)) {
    return { ms: null, error: "请输入有效数字" };
  }

  if (unit === "ms") {
    return { ms: n, error: "" };
  }

  if (unit === "s") {
    return { ms: n * 1000, error: "" };
  }

  if (/^\d+$/.test(trimmed)) {
    return trimmed.length >= 13 ? { ms: n, error: "" } : { ms: n * 1000, error: "" };
  }

  return { ms: n, error: "" };
}

export default function TimestampPage() {
  const [input, setInput] = useState("");
  const [unit, setUnit] = useState<Unit>("auto");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const preview = useMemo(() => {
    return parseToMs(input, unit);
  }, [input, unit]);

  const formatted = useMemo(() => {
    if (preview.error || preview.ms === null) {
      return null;
    }

    const date = new Date(preview.ms);
    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      unixS: Math.floor(preview.ms / 1000).toString(),
      unixMs: preview.ms.toString(),
    };
  }, [preview]);

  const isEmptyInput = input.trim() === "";

  const copyPayload = formatted
    ? [`ISO: ${formatted.iso}`, `Local: ${formatted.local}`, `Unix(s): ${formatted.unixS}`, `Unix(ms): ${formatted.unixMs}`].join("\n")
    : "";

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: Clock, label: "时间 · Epoch" }}
          breadcrumbLabel="时间戳"
          description="在本地把 Unix 时间戳转换为可读时间。支持秒/毫秒与自动识别（纯数字串长度 ≥13 视为毫秒）。"
          title="时间戳转换"
        />

        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <UnitButton active={unit === "auto"} label="自动" onClick={() => setUnit("auto")} />
              <UnitButton active={unit === "s"} label="秒（s）" onClick={() => setUnit("s")} />
              <UnitButton active={unit === "ms"} label="毫秒（ms）" onClick={() => setUnit("ms")} />
              <button
                className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 px-4 py-2 text-sm font-semibold text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:hover:bg-white/10"
                type="button"
                onClick={() => setInput(String(Date.now()))}
              >
                填入当前时间（ms）
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="ts-input">
                时间戳（留空则使用当前时间）
              </label>
              <input
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-4 py-3 text-sm font-mono text-[var(--text)] shadow-sm outline-none ring-offset-2 ring-offset-[var(--surface)] transition focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)]"
                id="ts-input"
                inputMode="numeric"
                placeholder="例如 1712131200 或 1712131200000"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </div>

            {preview.error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-900 dark:text-red-100">
                {preview.error}
              </div>
            ) : null}

            {isEmptyInput ? (
              <p className="text-sm text-[var(--text-muted)]">请输入时间戳，或点击「填入当前时间」。</p>
            ) : null}

            {formatted ? (
              <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--text)]">转换结果</p>
                  <CopyButton label="复制全部" text={copyPayload} />
                </div>
                <div className="grid gap-3 text-sm">
                  <Row label="ISO（UTC）" value={formatted.iso} />
                  <Row label="本地时间" value={formatted.local} />
                  <Row label="Unix（秒）" value={formatted.unixS} />
                  <Row label="Unix（毫秒）" value={formatted.unixMs} />
                </div>
              </div>
            ) : null}

            <p className="text-xs text-[var(--text-muted)]">
              提示：自动模式对「纯数字字符串」使用长度规则；其他格式请先统一为秒或毫秒。
            </p>
          </div>

          <aside>
            <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
          </aside>
        </section>
      </main>
    </div>
  );
}

function UnitButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-checked={active}
      className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-semibold outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
        active
          ? "border-[var(--accent)]/45 bg-[var(--accent)]/10 text-[var(--text)]"
          : "border-[var(--border)] bg-[var(--surface-elevated)]/60 text-[var(--text-muted)] hover:text-[var(--text)]"
      }`}
      role="radio"
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="text-[var(--text-muted)]">{label}</div>
      <div className="break-all font-mono text-[var(--text)]">{value}</div>
    </div>
  );
}
