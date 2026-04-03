"use client";

import { useMemo, useState } from "react";

import jsQR from "jsqr";
import { ScanQrCode } from "lucide-react";
import { useTranslations } from "next-intl";

import { CopyButton } from "@/components/copy-button";
import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";

const TOOL_ID = "qr-decode";

type DecodeState =
  | { status: "idle" }
  | { status: "decoded"; content: string; imageName: string }
  | { status: "error"; message: string };

export default function QrDecodePage() {
  const t = useTranslations("toolPages.qrDecode");
  const [state, setState] = useState<DecodeState>({ status: "idle" });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const decodedText = useMemo(() => (state.status === "decoded" ? state.content : ""), [state]);

  async function handleFileChange(file: File | null) {
    if (!file) {
      setState({ status: "idle" });
      setPreviewUrl("");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPreviewUrl(dataUrl);
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setState({ status: "error", message: t("canvasUnavailable") });
        return;
      }
      ctx.drawImage(bitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });
      bitmap.close();
      if (!result) {
        setState({ status: "error", message: t("decodeFailed") });
        return;
      }
      setState({
        status: "decoded",
        content: result.data,
        imageName: file.name,
      });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : t("decodeFailed"),
      });
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: ScanQrCode, label: t("badge") }}
          breadcrumbLabel={t("breadcrumb")}
          description={t("description")}
          title={t("title")}
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-5">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5">
              <label
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-subtle)]"
                htmlFor="qr-decode-file"
              >
                {t("pickImage")}
              </label>
              <input
                accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
                className="hidden"
                id="qr-decode-file"
                type="file"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
              <p className="mt-2 text-xs text-[var(--text-muted)]">{t("supportedFormats")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-4">
                <p className="text-sm font-semibold text-[var(--text)]">{t("preview")}</p>
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local file preview
                  <img alt={t("previewAlt")} className="mt-3 w-full rounded-xl border border-[var(--border)]" src={previewUrl} />
                ) : (
                  <p className="mt-3 text-sm text-[var(--text-muted)]">{t("emptyPreview")}</p>
                )}
              </div>

              <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--text)]">{t("decodedContent")}</p>
                  <CopyButton
                    historyDetail={decodedText.slice(0, 120)}
                    historyLabel={t("history.copyDecoded")}
                    label={t("copyDecoded")}
                    text={decodedText}
                    toolId={TOOL_ID}
                  />
                </div>
                {state.status === "decoded" ? (
                  <>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t("sourceImage")}: <span className="font-medium text-[var(--text)]">{state.imageName}</span>
                    </p>
                    <textarea
                      className="min-h-40 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-3 font-mono text-sm text-[var(--text)]"
                      id="qr-decoded-output"
                      readOnly
                      value={state.content}
                    />
                  </>
                ) : state.status === "error" ? (
                  <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-900 dark:text-red-100">
                    {state.message}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">{t("emptyResult")}</p>
                )}
              </div>
            </div>

            <p className="text-xs leading-relaxed text-[var(--text-muted)]">{t("tip")}</p>
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
