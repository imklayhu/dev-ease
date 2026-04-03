"use client";

import { useMemo, useState } from "react";

import { KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { appendToolHistory } from "@/lib/db/client";

const TOOL_ID = "password-generator";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}:;,.?";

function randomUint32(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]!;
}

function generatePassword(
  length: number,
  useLower: boolean,
  useUpper: boolean,
  useDigit: boolean,
  useSymbol: boolean,
): string {
  const pools: string[] = [];
  if (useLower) {
    pools.push(LOWER);
  }
  if (useUpper) {
    pools.push(UPPER);
  }
  if (useDigit) {
    pools.push(DIGITS);
  }
  if (useSymbol) {
    pools.push(SYMBOLS);
  }
  if (pools.length === 0 || length < 1) {
    return "";
  }

  const pool = pools.join("");
  const chars: string[] = [];

  for (const p of pools) {
    chars.push(p[randomUint32() % p.length]!);
  }
  while (chars.length < length) {
    chars.push(pool[randomUint32() % pool.length]!);
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomUint32() % (i + 1);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }

  return chars.join("");
}

export default function PasswordGeneratorPage() {
  const t = useTranslations("toolPages.passwordGenerator");
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigit, setUseDigit] = useState(true);
  const [useSymbol, setUseSymbol] = useState(true);
  /** 仅用于「重新生成」时 bump，使 useMemo 重新计算随机串 */
  const [regenNonce, setRegenNonce] = useState(0);
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const canGenerate = useLower || useUpper || useDigit || useSymbol;

  const password = useMemo(() => {
    void regenNonce;
    if (!canGenerate) {
      return "";
    }
    return generatePassword(length, useLower, useUpper, useDigit, useSymbol);
  }, [canGenerate, length, useDigit, useLower, useSymbol, useUpper, regenNonce]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: KeyRound, label: "安全 · 本地随机" }}
          breadcrumbLabel="密码生成器"
          description="使用浏览器 crypto.getRandomValues 生成长度可调的密码。仅在前端生成，不会上传到服务器；生产环境口令策略请以组织规范为准。"
          title="随机密码生成"
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text)]" htmlFor="pwd-len">
                  {t("length")}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    className="h-2 w-40 max-w-full cursor-pointer accent-[var(--accent-violet)]"
                    id="pwd-len"
                    max={64}
                    min={4}
                    type="range"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                  />
                  <span className="font-mono text-sm tabular-nums text-[var(--text)]">{length}</span>
                </div>
              </div>
              <button
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/10"
                type="button"
                onClick={() => {
                  void appendToolHistory({ toolId: TOOL_ID, label: t("history.regenerate") });
                  setRegenNonce((n) => n + 1);
                }}
              >
                {t("regenerate")}
              </button>
            </div>

            <fieldset className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/50 p-4">
              <legend className="px-1 text-sm font-semibold text-[var(--text)]">{t("charset")}</legend>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-muted)]">
                <input checked={useLower} type="checkbox" onChange={(e) => setUseLower(e.target.checked)} />
                {t("lower")}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-muted)]">
                <input checked={useUpper} type="checkbox" onChange={(e) => setUseUpper(e.target.checked)} />
                {t("upper")}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-muted)]">
                <input checked={useDigit} type="checkbox" onChange={(e) => setUseDigit(e.target.checked)} />
                {t("digit")}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-muted)]">
                <input checked={useSymbol} type="checkbox" onChange={(e) => setUseSymbol(e.target.checked)} />
                {t("symbol")} {SYMBOLS.slice(0, 12)}…
              </label>
            </fieldset>

            {!canGenerate ? (
              <p className="text-sm text-amber-800 dark:text-amber-200">{t("chooseOne")}</p>
            ) : null}

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--text)]">{t("resultTitle")}</p>
              <div className="flex flex-wrap items-center gap-2 break-all rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-sm text-[var(--text)]">
                {password || t("emptyResult")}
              </div>
              <CopyButton
                historyDetail={password ? t("maskedCopied") : undefined}
                historyLabel={t("history.copyPassword")}
                label={t("copyPassword")}
                text={password}
                toolId={TOOL_ID}
              />
            </div>
          </div>

          <div className="space-y-4">
            <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
            <ToolHistoryPanel toolId={TOOL_ID} />
          </div>
        </section>
      </main>
    </div>
  );
}
