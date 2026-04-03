"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { ChevronDown, Globe } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABEL: Record<string, string> = {
  zh: "中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
};

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) {
        return;
      }
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={t("language")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/60 px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition duration-200 hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/10 hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        onClick={() => setOpen((v) => !v)}
      >
        <Globe aria-hidden className="h-4 w-4" />
        <span className="hidden sm:inline">{LOCALE_LABEL[locale] ?? locale}</span>
        <ChevronDown aria-hidden className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("language")}
          className="absolute right-0 top-[calc(100%+10px)] z-[70] w-44 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 p-2 shadow-[var(--shadow)] backdrop-blur-xl"
        >
          <div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            {t("language")}
          </div>

          <div className="flex flex-col gap-1">
            {routing.locales.map((item) => {
              const selected = item === locale;
              return (
                <Link
                  key={item}
                  href={pathname}
                  locale={item}
                  role="menuitem"
                  aria-current={selected ? "page" : undefined}
                  className={
                    selected
                      ? "cursor-pointer rounded-xl border border-transparent bg-gradient-to-br from-[var(--accent-violet)]/25 via-[var(--accent-fuchsia)]/15 to-[var(--accent)]/15 px-3 py-2 text-sm font-semibold text-[var(--text)] outline-none ring-offset-2 ring-offset-[var(--surface)]"
                      : "cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-muted)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:bg-[var(--accent-violet)]/10 hover:text-[var(--text)]"
                  }
                  onClick={() => setOpen(false)}
                >
                  {LOCALE_LABEL[item] ?? item}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
