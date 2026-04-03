import type { Metadata } from "next";

import { Info } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteInfo } from "@/components/site-info";
import { ThemeSettings } from "@/components/theme-settings";
import { UsageInsights } from "@/components/usage-insights";
import { Link } from "@/i18n/navigation";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAlt } from "@/lib/seo-shared";
import { absoluteUrl } from "@/lib/site-url";

const aboutOgImages = [
  {
    url: OG_IMAGE_PATH,
    ...OG_IMAGE_DIMENSIONS,
    alt: ogImageAlt(),
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");
  const canonical = absoluteUrl("/settings/", locale);

  return {
    title: t("title"),
    description: t("description", { brand: BRAND_DISPLAY_NAME }),
    alternates: { canonical },
    openGraph: {
      title: `${t("title")} · ${BRAND_DISPLAY_NAME}`,
      description: t("description", { brand: BRAND_DISPLAY_NAME }),
      url: canonical,
      images: aboutOgImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} · ${BRAND_DISPLAY_NAME}`,
      description: t("description", { brand: BRAND_DISPLAY_NAME }),
      images: [OG_IMAGE_PATH],
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");
  const tNav = await getTranslations("nav");

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 pb-16 pt-8" id="main-content">
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
            <li className="text-[var(--text)]">{t("title")}</li>
          </ol>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-violet)]/25 bg-gradient-to-r from-[var(--accent-violet)]/12 to-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--text-muted)] ring-1 ring-[var(--border)]">
            <Info aria-hidden className="h-4 w-4 text-[var(--accent-violet)]" />
            {t("badge")}
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-balance text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
              {t("title")}
            </h1>
            <p className="text-pretty text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              {t("lead", { brand: BRAND_DISPLAY_NAME })}
            </p>
          </div>
        </header>

        <div className="space-y-12">
          <section aria-labelledby="site-info-heading" className="space-y-4">
            <h2 className="sr-only" id="site-info-heading">
              {t("siteInfoHeading")}
            </h2>
            <SiteInfo />
          </section>

          <UsageInsights />

          <section aria-label={t("themeSectionAria")} className="space-y-4">
            <ThemeSettings />
          </section>
        </div>
      </main>
    </div>
  );
}
