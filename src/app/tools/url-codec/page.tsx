"use client";

import { useMemo, useState } from "react";

import { Link2 } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";

const TOOL_ID = "url-codec";

const TEXTAREA_CLASS =
  "min-h-52 w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-4 text-sm leading-6 text-[var(--text)] shadow-sm shadow-black/5 outline-none ring-offset-2 ring-offset-[var(--surface)] transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)] dark:shadow-black/40 font-mono";

type Mode = "encode" | "decode";

export default function UrlCodecPage() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const { output, error } = useMemo(() => {
    if (!input) {
      return { output: "", error: "" };
    }

    try {
      return {
        output: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input),
        error: "",
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : "转换失败";
      return { output: "", error: message };
    }
  }, [input, mode]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: Link2, label: "URL · 组件编码" }}
          breadcrumbLabel="URL 编解码"
          description="使用 encodeURIComponent / decodeURIComponent，适合处理查询参数与片段中的特殊字符。"
          title="URL 组件编解码"
        />

        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div
              aria-label="模式"
              className="inline-flex rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/60 p-1"
              role="radiogroup"
            >
              <ModeButton active={mode === "encode"} label="编码" onClick={() => setMode("encode")} />
              <ModeButton active={mode === "decode"} label="解码" onClick={() => setMode("decode")} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="url-input">
                输入
              </label>
              <textarea
                className={TEXTAREA_CLASS}
                id="url-input"
                spellCheck={false}
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-900 dark:text-red-100">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <CopyButton label="复制输出" text={output} />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--text)]">输出</p>
              <textarea className={`${TEXTAREA_CLASS} min-h-40`} readOnly value={output} />
            </div>
          </div>

          <aside>
            <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
          </aside>
        </section>
      </main>
    </div>
  );
}

function ModeButton({
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
      className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
        active ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]"
      }`}
      role="radio"
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
