"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";

import { appendToolHistory } from "@/lib/db/client";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
  /** 与 historyLabel 同时传入时，复制成功后写入工具操作历史 */
  toolId?: string;
  historyLabel?: string;
  /** 写入历史的可选摘要（如内容前缀，勿传长敏感正文） */
  historyDetail?: string;
};

export function CopyButton({
  text,
  label = "复制",
  className,
  toolId,
  historyLabel,
  historyDetail,
}: CopyButtonProps) {
  const [ok, setOk] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      window.setTimeout(() => setOk(false), 1500);
      if (toolId && historyLabel) {
        await appendToolHistory({
          toolId,
          label: historyLabel,
          detail: historyDetail,
        });
      }
    } catch (error) {
      console.error("Clipboard write failed.", error);
    }
  };

  return (
    <button
      className={
        className ??
        "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 px-3 py-2 text-sm font-semibold text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10"
      }
      disabled={!text}
      type="button"
      onClick={onCopy}
    >
      {ok ? <Check aria-hidden className="h-4 w-4 text-[var(--accent)]" /> : <Copy aria-hidden className="h-4 w-4" />}
      {ok ? "已复制" : label}
    </button>
  );
}
