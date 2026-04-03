"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Info, X } from "lucide-react";

import { SiteInfo } from "@/components/site-info";
import { ThemeSettings } from "@/components/theme-settings";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";

const clientSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
  return useSyncExternalStore(clientSubscribe, getClientSnapshot, getServerSnapshot);
}

export function AboutDrawer() {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    closeButtonRef.current?.focus();
  }, [open]);

  const overlay =
    open && isClient ? (
      <div className="fixed inset-0 z-[80]">
        <button
          aria-label="关闭关于面板"
          className="absolute inset-0 z-0 cursor-pointer bg-black/45 backdrop-blur-[1px]"
          type="button"
          onClick={close}
        />

        <div
          ref={panelRef}
          aria-labelledby={titleId}
          aria-modal="true"
          className="absolute inset-y-0 right-0 z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--border-strong)] bg-[var(--surface)]/95 shadow-2xl shadow-black/40 outline-none backdrop-blur-xl dark:shadow-black/60"
          role="dialog"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[var(--accent-violet)]/50 via-[var(--accent-fuchsia)]/25 to-[var(--accent)]/35"
          />
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface-elevated)]/40 px-5 py-4">
            <div className="min-w-0 pr-2">
              <h2 className="font-display text-lg font-bold tracking-tight text-[var(--text)]" id={titleId}>
                关于我们
              </h2>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                {BRAND_DISPLAY_NAME} 的站点说明与本地偏好。需要更大版面可查看{" "}
                <Link
                  className="cursor-pointer font-medium text-[var(--accent-violet)] underline-offset-4 hover:underline"
                  href="/settings/"
                  onClick={close}
                >
                  完整页面
                </Link>
                。
              </p>
            </div>

            <button
              ref={closeButtonRef}
              aria-label="关闭"
              className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-2 text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/10 focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              type="button"
              onClick={close}
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
            <div className="flex flex-col gap-8">
              <section aria-labelledby="site-meta-heading">
                <SiteInfo variant="inline" />
              </section>

              <div
                aria-hidden
                className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent"
              />

              <section aria-label="主题与外观">
                <ThemeSettings variant="minimal" />
              </section>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className="flex items-center gap-1">
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-muted)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 hover:bg-[var(--accent-violet)]/10 hover:text-[var(--text)] hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-violet)_30%,transparent)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        type="button"
        onClick={() => setOpen(true)}
      >
        <Info aria-hidden className="h-4 w-4" />
        <span className="hidden sm:inline">关于我们</span>
      </button>

      {isClient && overlay ? createPortal(overlay, document.body) : null}
    </div>
  );
}
