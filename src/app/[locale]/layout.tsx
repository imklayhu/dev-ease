import type { Metadata } from "next";
import type { ReactNode } from "react";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LocaleHtmlLang } from "@/components/locale-html-lang";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteJsonLd } from "@/components/site-json-ld";
import { SkipLink } from "@/components/skip-link";
import { routing } from "@/i18n/routing";
import { toolCount } from "@/data/tools";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { localeAlternates } from "@/lib/locale-alternates";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAltForLocale } from "@/lib/seo-shared";
import { absoluteUrl, SITE_ORIGIN } from "@/lib/site-url";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  setRequestLocale(locale);
  const tHome = await getTranslations("home");
  const tSeo = await getTranslations("seo");
  const defaultDescription = tHome("metaDescription", { brand: BRAND_DISPLAY_NAME, toolCount });
  const siteKeywords = tSeo("siteKeywords")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const canonical = absoluteUrl("/", locale);
  const ogLocale = locale === "zh" ? "zh_CN" : "en_US";

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: { default: BRAND_DISPLAY_NAME, template: `%s · ${BRAND_DISPLAY_NAME}` },
    description: defaultDescription,
    applicationName: BRAND_DISPLAY_NAME,
    keywords: siteKeywords,
    authors: [{ name: BRAND_DISPLAY_NAME, url: canonical }],
    creator: BRAND_DISPLAY_NAME,
    robots: { index: true, follow: true },
    alternates: localeAlternates("/", locale),
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: canonical,
      siteName: BRAND_DISPLAY_NAME,
      title: BRAND_DISPLAY_NAME,
      description: defaultDescription,
      images: [
        {
          url: OG_IMAGE_PATH,
          ...OG_IMAGE_DIMENSIONS,
          alt: ogImageAltForLocale(locale),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: BRAND_DISPLAY_NAME,
      description: defaultDescription,
      images: [OG_IMAGE_PATH],
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const tHome = await getTranslations("home");
  const siteDescription = tHome("metaDescription", { brand: BRAND_DISPLAY_NAME, toolCount });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleHtmlLang />
      <SiteJsonLd locale={locale} siteDescription={siteDescription} />
      <SkipLink />
      <SiteHeader />
      {children}
      <SiteFooter />
    </NextIntlClientProvider>
  );
}
