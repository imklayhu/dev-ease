"use client";

import { useEffect, useRef, useState } from "react";

import { QrCode } from "lucide-react";
import { useTranslations } from "next-intl";

import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { appendToolHistory } from "@/lib/db/client";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "qr-code";

export default function QrCodePage() {
  const t = useTranslations("toolPages.qrCode");
  const [text, setText] = useState("https://github.com/imklayhu/dev-ease");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState("");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);
  const lastLoggedContent = useRef<string>("");

  useEffect(() => {
    let cancelled = false;
    const trimmed = text.trim();
    if (!trimmed) {
      setDataUrl("");
      setError("");
      return;
    }

    void import("qrcode")
      .then((QR) =>
        QR.toDataURL(trimmed, {
          width: 280,
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: "#0f172a", light: "#ffffff" },
        }),
      )
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setError("");
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setDataUrl("");
          setError(e instanceof Error ? e.message : t("generateFailed"));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [text, t]);

  useEffect(() => {
    const trimmed = text.trim();
    if (!dataUrl || !trimmed) {
      return;
    }
    const timer = window.setTimeout(() => {
      if (lastLoggedContent.current === trimmed) {
        return;
      }
      lastLoggedContent.current = trimmed;
      void appendToolHistory({
        toolId: TOOL_ID,
        label: t("history.generated"),
        detail: trimmed.slice(0, 120),
      });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [dataUrl, text, t]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: QrCode, label: "二维码 · 本地渲染" }}
          breadcrumbLabel="二维码生成"
          description="将文本或链接生成 QR 码 PNG（Data URL）。全部在浏览器内完成；若内容过长，二维码会变得更密，扫描难度上升。"
          title="二维码生成"
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="qr-text">
                {t("content")}
              </label>
              <textarea
                className={TOOL_TEXTAREA_CLASS}
                id="qr-text"
                placeholder={t("placeholder")}
                spellCheck={false}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-900 dark:text-red-100">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-4">
              <p className="text-sm font-semibold text-[var(--text)]">{t("preview")}</p>
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Data URL from qrcode
                <img alt={t("previewAlt")} className="h-[280px] w-[280px] max-w-full bg-white p-2" height={280} src={dataUrl} width={280} />
              ) : (
                <p className="text-sm text-[var(--text-muted)]">{text.trim() ? t("generating") : t("enterContent")}</p>
              )}
              {dataUrl ? (
                <a
                  className="text-sm font-medium text-[var(--accent-violet)] underline-offset-4 hover:underline"
                  download="qrcode.png"
                  href={dataUrl}
                >
                  {t("downloadPng")}
                </a>
              ) : null}
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
