"use client";

import { useLocale, useTranslations } from "next-intl";

import { Globe } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABEL: Record<string, string> = {
  zh: "中文",
  en: "English",
};

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      aria-label={t("language")}
      className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/60 p-1"
      role="group"
    >
      <span className="px-1.5 text-[var(--text-faint)]">
        <Globe aria-hidden className="h-4 w-4" />
      </span>
      {routing.locales.map((item) => {
        const selected = item === locale;
        return (
          <Link
            key={item}
            href={pathname}
            locale={item}
            aria-current={selected ? "page" : undefined}
            className={
              selected
                ? "cursor-pointer rounded-lg bg-[var(--surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text)] ring-1 ring-[var(--border)]"
                : "cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--accent-violet)]/10 hover:text-[var(--text)]"
            }
          >
            {LOCALE_LABEL[item] ?? item}
          </Link>
        );
      })}
    </div>
  );
}
