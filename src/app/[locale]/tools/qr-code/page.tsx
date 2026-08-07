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

const QR_SIZE = 280;
/** 图标区域占二维码边长的比例（居中，约 22%） */
const LOGO_RATIO = 0.22;
const MAX_LOGO_FILE_BYTES = 10 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/** 在二维码中心合成一个居中图标，返回合并后的 PNG Data URL */
async function renderQrWithLogo(
  text: string,
  logoDataUrl: string,
): Promise<string> {
  const QR = await import("qrcode");
  const canvas = document.createElement("canvas");

  await QR.toCanvas(canvas, text, {
    width: QR_SIZE,
    margin: 2,
    // 中心被图标遮挡时，用 H(30%) 纠错提升可扫描性
    errorCorrectionLevel: "H",
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  const icon = new Image();
  icon.src = logoDataUrl;
  await icon.decode();

  const iconBox = Math.round(canvas.width * LOGO_RATIO);
  const boxX = (canvas.width - iconBox) / 2;
  const boxY = (canvas.height - iconBox) / 2;

  // 先垫白色圆角背景，避免深色图标破坏模块识别
  const pad = Math.max(2, Math.round(iconBox * 0.06));
  ctx.fillStyle = "#ffffff";
  drawRoundedRect(ctx, boxX - pad, boxY - pad, iconBox + pad * 2, iconBox + pad * 2, 8);
  ctx.fill();

  // 保持图标宽高比居中绘制
  const scale = Math.min(iconBox / icon.width, iconBox / icon.height);
  const drawW = icon.width * scale;
  const drawH = icon.height * scale;
  ctx.drawImage(icon, boxX + (iconBox - drawW) / 2, boxY + (iconBox - drawH) / 2, drawW, drawH);

  return canvas.toDataURL("image/png");
}

export default function QrCodePage() {
  const t = useTranslations("toolPages.qrCode");
  const [text, setText] = useState("https://github.com/imklayhu/dev-ease");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [logoName, setLogoName] = useState("");
  const [logoError, setLogoError] = useState("");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState("");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);
  const lastLoggedContent = useRef<string>("");

  async function handleLogoFile(file: File | null) {
    setLogoError("");
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setLogoError(t("logoNotImage"));
      return;
    }
    if (file.size > MAX_LOGO_FILE_BYTES) {
      setLogoError(t("logoTooLarge"));
      return;
    }
    try {
      const dataUrlOfLogo = await readFileAsDataUrl(file);
      setLogoDataUrl(dataUrlOfLogo);
      setLogoName(file.name);
    } catch {
      setLogoError(t("logoReadFailed"));
    }
  }

  function clearLogo() {
    setLogoDataUrl("");
    setLogoName("");
    setLogoError("");
  }

  useEffect(() => {
    let cancelled = false;
    const trimmed = text.trim();
    if (!trimmed) {
      setDataUrl("");
      setError("");
      return;
    }

    const generate = async () => {
      try {
        const url = logoDataUrl
          ? await renderQrWithLogo(trimmed, logoDataUrl)
          : await import("qrcode").then((QR) =>
              QR.toDataURL(trimmed, {
                width: QR_SIZE,
                margin: 2,
                errorCorrectionLevel: "M",
                color: { dark: "#0f172a", light: "#ffffff" },
              }),
            );
        if (!cancelled) {
          setDataUrl(url);
          setError("");
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setDataUrl("");
          setError(e instanceof Error ? e.message : t("generateFailed"));
        }
      }
    };

    void generate();

    return () => {
      cancelled = true;
    };
  }, [text, logoDataUrl, t]);

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

            <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text)]">{t("logoLabel")}</p>
                  <p className="text-xs leading-relaxed text-[var(--text-muted)]">{t("logoHint")}</p>
                </div>

                {logoName ? (
                  <div className="flex items-center gap-3">
                    <span className="max-w-40 truncate text-sm font-medium text-[var(--text)]">{logoName}</span>
                    <button
                      className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--text-muted)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:bg-red-500/10 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      type="button"
                      onClick={clearLogo}
                    >
                      {t("removeLogo")}
                    </button>
                  </div>
                ) : (
                  <label
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-subtle)]"
                    htmlFor="qr-logo-file"
                  >
                    {t("chooseLogo")}
                  </label>
                )}
              </div>
              <input
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/bmp"
                className="hidden"
                id="qr-logo-file"
                type="file"
                onChange={(e) => void handleLogoFile(e.target.files?.[0] ?? null)}
              />
              {logoError ? (
                <p className="text-sm text-red-700 dark:text-red-300">{logoError}</p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-900 dark:text-red-100">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-4">
              <p className="text-sm font-semibold text-[var(--text)]">{t("preview")}</p>
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Data URL from qrcode/canvas
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
