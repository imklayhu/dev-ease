"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Hash } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";

const TOOL_ID = "crypto-hash";

const ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

const TEXTAREA_CLASS =
  "min-h-52 w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-4 text-sm leading-6 text-[var(--text)] shadow-sm shadow-black/5 outline-none ring-offset-2 ring-offset-[var(--surface)] transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)] dark:shadow-black/40 font-mono";

async function digestHex(algorithm: Algorithm, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algorithm, data);
  const bytes = new Uint8Array(buf);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function CryptoHashPage() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [hex, setHex] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const subtleAvailable = useMemo(() => {
    return typeof crypto !== "undefined" && !!crypto.subtle;
  }, []);

  const run = useCallback(async () => {
    setError("");
    setHex("");

    if (!subtleAvailable) {
      setError("当前环境不支持 Web Crypto（需要安全上下文：HTTPS 或 localhost）。");
      return;
    }

    setBusy(true);
    try {
      const out = await digestHex(algorithm, input);
      setHex(out);
    } catch (e) {
      const message = e instanceof Error ? e.message : "计算失败";
      setError(message);
    } finally {
      setBusy(false);
    }
  }, [algorithm, input, subtleAvailable]);

  useEffect(() => {
    if (!subtleAvailable) {
      return;
    }

    const id = window.setTimeout(() => {
      void run();
    }, 350);

    return () => window.clearTimeout(id);
  }, [run, subtleAvailable]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: Hash, label: "Web Crypto · SHA" }}
          breadcrumbLabel="哈希摘要"
          description="使用浏览器 Web Crypto（SHA-256/384/512）对 UTF-8 文本计算摘要，输出十六进制字符串。"
          title="文本哈希（SHA）"
        />

        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            {!subtleAvailable ? (
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-950 dark:text-amber-100">
                当前页面环境不可用：`crypto.subtle` 需要 HTTPS 或 localhost。
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {ALGORITHMS.map((item) => (
                <button
                  key={item}
                  className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-semibold outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                    algorithm === item
                      ? "border-[var(--accent)]/45 bg-[var(--accent)]/10 text-[var(--text)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)]/60 text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                  type="button"
                  onClick={() => setAlgorithm(item)}
                >
                  {item}
                </button>
              ))}
              <button
                className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 px-4 py-2 text-sm font-semibold text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10"
                disabled={busy || !subtleAvailable}
                type="button"
                onClick={() => void run()}
              >
                {busy ? "计算中…" : "重新计算"}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="hash-input">
                输入文本
              </label>
              <textarea
                className={TEXTAREA_CLASS}
                id="hash-input"
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
              <CopyButton
                historyDetail={hex ? hex.slice(0, 120) : undefined}
                historyLabel="复制哈希 HEX"
                label="复制 HEX"
                text={hex}
                toolId={TOOL_ID}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--text)]">HEX 摘要</p>
              <textarea className={`${TEXTAREA_CLASS} min-h-28`} readOnly value={hex} />
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              提示：超大文本可能耗时更长；敏感内容请注意本地环境安全。
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
