import type { Metadata } from "next";

import { BookOpen } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { GuideListJsonLd } from "@/components/guide-json-ld";
import { guides } from "@/data/guides";
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
  const canonical = absoluteUrl("/guides/", locale);
  const title = t("breadcrumb");
  const indexDescription = t("metaDescription", { brand: BRAND_DISPLAY_NAME });

  return {
    title,
    description: indexDescription,
    alternates: localeAlternates("/guides/", locale),
    openGraph: {
      title: `${title} · ${BRAND_DISPLAY_NAME}`,
      description: indexDescription,
      url: canonical,
      images: [
        { url: OG_IMAGE_PATH, ...OG_IMAGE_DIMENSIONS, alt: ogImageAltForLocale(locale) },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${BRAND_DISPLAY_NAME}`,
      description: indexDescription,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default async function GuidesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guides");
  const tNav = await getTranslations("nav");
  const localizedGuides = guides.map((guide) => {
    const keyPrefix = `items.${guide.slug}`;
    const read = (key: "title" | "description", fallback: string): string => {
      try {
        return t(`${keyPrefix}.${key}` as never) as string;
      } catch {
        return fallback;
      }
    };
    return {
      ...guide,
      title: read("title", guide.title),
      description: read("description", guide.description),
    };
  });

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 pb-20 pt-10" id="main-content">
        <GuideListJsonLd guides={localizedGuides} locale={locale} name={t("breadcrumb")} />
        <nav aria-label={tNav("breadcrumbAria")} className="text-sm text-[var(--text-muted)]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                className="cursor-pointer rounded-md font-medium text-[var(--accent-violet)] underline-offset-4 transition hover:text-[var(--text)] hover:underline"
                href="/"
              >
                {tNav("home")}
              </Link>
            </li>
            <li aria-hidden className="text-[var(--text-muted)]/70">
              /
            </li>
            <li className="text-[var(--text)]">{t("breadcrumb")}</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-violet)]/25 bg-gradient-to-r from-[var(--accent-violet)]/12 to-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--text-muted)] ring-1 ring-[var(--border)]">
            <BookOpen aria-hidden className="h-4 w-4 text-[var(--accent-violet)]" />
            {t("badge")}
          </div>
          <h1 className="font-display text-balance text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
            {t("indexTitle", { brand: BRAND_DISPLAY_NAME })}
          </h1>
          <p className="text-pretty text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            {t("indexLead")}
          </p>
        </header>

        <ul className="space-y-4" role="list">
          {localizedGuides.map((g) => (
            <li key={g.slug}>
              <Link
                className="block rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5 shadow-sm shadow-black/5 outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/6 focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:shadow-black/40"
                href={`/guides/${g.slug}/`}
              >
                <p className="font-mono text-[11px] text-[var(--text-faint)]">{g.date}</p>
                <h2 className="mt-2 font-display text-lg font-bold text-[var(--text)]">{g.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{g.description}</p>
                <p className="mt-3 text-sm font-medium text-[var(--accent-violet)]">{t("readMore")}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
