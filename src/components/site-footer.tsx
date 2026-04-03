import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { BRAND_DISPLAY_NAME, SITE_REPOSITORY_URL } from "@/lib/brand";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--border-strong)] bg-[var(--surface)]/80 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-violet)]/45 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[min(90%,42rem)] -translate-x-1/2 rounded-full bg-[var(--accent-violet)]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm leading-7 text-[var(--text-muted)] md:max-w-2xl md:text-[15px]">
            © {new Date().getFullYear()} {BRAND_DISPLAY_NAME} · {t("line")}
          </p>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link
              className="cursor-pointer font-medium text-[var(--text-muted)] underline-offset-4 transition hover:text-[var(--text)] hover:underline"
              href="/settings/"
            >
              {t("about")}
            </Link>
            <Link
              className="cursor-pointer font-medium text-[var(--text-muted)] underline-offset-4 transition hover:text-[var(--text)] hover:underline"
              href="/guides/"
            >
              {t("guides")}
            </Link>
            <a
              className="cursor-pointer font-medium text-[var(--text-muted)] underline-offset-4 transition hover:text-[var(--text)] hover:underline"
              href={SITE_REPOSITORY_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("repo")}
            </a>
          </nav>
        </div>

        <div className="mt-5 border-t border-[var(--border)]/80 pt-4">
          <p className="font-mono text-xs text-[var(--text-faint)]">{t("stack")}</p>
        </div>
      </div>
    </footer>
  );
}
