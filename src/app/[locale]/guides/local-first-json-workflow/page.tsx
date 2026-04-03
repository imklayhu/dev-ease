import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { localeAlternates } from "@/lib/locale-alternates";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAltForLocale } from "@/lib/seo-shared";
import { absoluteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guides");
  const title = t("localFirst.title");
  const description = t("localFirst.description");
  const canonical = absoluteUrl("/guides/local-first-json-workflow/", locale);

  return {
    title,
    description,
    alternates: localeAlternates("/guides/local-first-json-workflow/", locale),
    openGraph: {
      title: `${title} · ${BRAND_DISPLAY_NAME}`,
      description,
      url: canonical,
      images: [
        { url: OG_IMAGE_PATH, ...OG_IMAGE_DIMENSIONS, alt: ogImageAltForLocale(locale) },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${BRAND_DISPLAY_NAME}`,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default async function GuideLocalFirstJsonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guides");
  const tNav = await getTranslations("nav");

  return (
    <div className="flex flex-1 flex-col">
      <article
        className="mx-auto w-full max-w-3xl flex-1 px-6 pb-20 pt-10 text-[var(--text-muted)]"
        id="main-content"
      >
        <nav aria-label={tNav("breadcrumbAria")} className="text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                className="font-medium text-[var(--accent-violet)] underline-offset-4 hover:underline"
                href="/"
              >
                {tNav("home")}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link className="font-medium text-[var(--accent-violet)] underline-offset-4 hover:underline" href="/guides/">
                {tNav("guides")}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-[var(--text)]">{t("localFirst.breadcrumbCurrent")}</li>
          </ol>
        </nav>

        <header className="mt-8 space-y-3">
          <p className="font-mono text-[11px] text-[var(--text-faint)]">{t("localFirst.date")}</p>
          <h1 className="font-display text-balance text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
            {t("localFirst.title")}
          </h1>
          <p className="text-pretty text-sm leading-7 sm:text-base">{t("localFirst.description")}</p>
        </header>

        <div className="mt-10 space-y-6 text-[15px] leading-8 sm:text-base">
          <p>
            {t.rich("localFirst.p1", {
              strong: (chunks) => <strong className="text-[var(--text)]">{chunks}</strong>,
            })}
          </p>
          <p>
            {t.rich("localFirst.p2", {
              brand: BRAND_DISPLAY_NAME,
              formatterLink: (chunks) => (
                <Link
                  className="font-medium text-[var(--accent-violet)] underline-offset-4 hover:underline"
                  href="/tools/json-formatter/"
                >
                  {chunks}
                </Link>
              ),
              code: (chunks) => (
                <code className="rounded bg-[var(--surface-subtle)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--text)]">
                  {chunks}
                </code>
              ),
              strong: (chunks) => <strong className="text-[var(--text)]">{chunks}</strong>,
            })}
          </p>
          <p>
            {t.rich("localFirst.p3", {
              settingsLink: (chunks) => (
                <Link
                  className="font-medium text-[var(--accent-violet)] underline-offset-4 hover:underline"
                  href="/settings/"
                >
                  {chunks}
                </Link>
              ),
              strong: (chunks) => <strong className="text-[var(--text)]">{chunks}</strong>,
            })}
          </p>
          <h2 className="font-display text-xl font-bold text-[var(--text)]">{t("localFirst.summaryTitle")}</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>{t("localFirst.li1")}</li>
            <li>{t("localFirst.li2")}</li>
            <li>{t("localFirst.li3")}</li>
          </ul>
        </div>

        <footer className="mt-12 border-t border-[var(--border)] pt-8">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-violet)] underline-offset-4 hover:underline"
            href="/guides/"
          >
            {t("localFirst.backToList")}
          </Link>
        </footer>
      </article>
    </div>
  );
}
