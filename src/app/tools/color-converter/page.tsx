"use client";

import { useMemo, useState } from "react";

import { Palette } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { parseColorLoose } from "@/lib/color";

const TOOL_ID = "color-converter";

const INPUT_CLASS =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-4 py-3 text-sm text-[var(--text)] shadow-sm outline-none ring-offset-2 ring-offset-[var(--surface)] transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--ring)] font-mono";

export default function ColorConverterPage() {
  const [input, setInput] = useState("#22c55e");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const parsed = useMemo(() => parseColorLoose(input), [input]);

  const copyAll = useMemo(() => {
    if ("error" in parsed) {
      return "";
    }

    const { rgb, hsl, hex } = parsed;
    return [
      `HEX: ${hex}`,
      `RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      `HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    ].join("\n");
  }, [parsed]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: Palette, label: "HEX · RGB · HSL" }}
          breadcrumbLabel="颜色转换"
          description="解析常见颜色字符串并互转。支持 #RGB/#RRGGBB、rgb()、hsl()（alpha 暂不参与互转）。"
          title="颜色转换"
        />

        <section className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="color-input">
                输入颜色
              </label>
              <input
                className={INPUT_CLASS}
                id="color-input"
                placeholder="#22c55e / rgb(34, 197, 94) / hsl(142, 71%, 45%)"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </div>

            {"error" in parsed ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-900 dark:text-red-100">
                {parsed.error}
              </div>
            ) : null}

            {"error" in parsed ? null : (
              <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-start">
                <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--text)]">预览</p>
                    <CopyButton label="复制全部" text={copyAll} />
                  </div>

                  <div
                    aria-label="颜色预览"
                    className="h-28 w-full rounded-2xl border border-[var(--border)]"
                    style={{ backgroundColor: parsed.hex }}
                  />

                  <div className="space-y-2 text-sm">
                    <Row label="HEX" value={parsed.hex} />
                    <Row
                      label="RGB"
                      value={`rgb(${parsed.rgb.r}, ${parsed.rgb.g}, ${parsed.rgb.b})`}
                    />
                    <Row
                      label="HSL"
                      value={`hsl(${parsed.hsl.h}, ${parsed.hsl.s}%, ${parsed.hsl.l}%)`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/40 p-6 text-sm text-[var(--text-muted)]">
                  <p className="font-semibold text-[var(--text)]">示例</p>
                  <button
                    className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 px-3 py-2 text-left font-mono text-xs text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:hover:bg-white/10"
                    type="button"
                    onClick={() => setInput("#0f172a")}
                  >
                    #0f172a
                  </button>
                  <button
                    className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 px-3 py-2 text-left font-mono text-xs text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:hover:bg-white/10"
                    type="button"
                    onClick={() => setInput("rgb(34, 197, 94)")}
                  >
                    rgb(34, 197, 94)
                  </button>
                  <button
                    className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 px-3 py-2 text-left font-mono text-xs text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:hover:bg-white/10"
                    type="button"
                    onClick={() => setInput("hsl(142, 71%, 45%)")}
                  >
                    hsl(142, 71%, 45%)
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-[var(--text-muted)]">
              提示：不同颜色空间转换存在舍入误差；需要印刷/品牌色请以设计稿为准。
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="text-[var(--text-muted)]">{label}</div>
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <div className="break-all font-mono text-[var(--text)]">{value}</div>
        <CopyButton className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 px-3 py-2 text-xs font-semibold text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10" label={`复制${label}`} text={value} />
      </div>
    </div>
  );
}
