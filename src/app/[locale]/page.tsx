import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomeJsonLd } from "@/components/home-json-ld";
import { ToolCard } from "@/components/tool-card";
import { Link } from "@/i18n/navigation";
import { getToolsGrouped, toolCount } from "@/data/tools";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";
import { localeAlternates } from "@/lib/locale-alternates";
import { OG_IMAGE_DIMENSIONS, OG_IMAGE_PATH, ogImageAltForLocale } from "@/lib/seo-shared";
import { absoluteUrl } from "@/lib/site-url";

const homeOgImages = (locale: string) => [
  {
    url: OG_IMAGE_PATH,
    ...OG_IMAGE_DIMENSIONS,
    alt: ogImageAltForLocale(locale),
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const canonical = absoluteUrl("/", locale);
  const homeDescription = t("metaDescription", { brand: BRAND_DISPLAY_NAME, toolCount });
  const homeTitle = t("metaTitle");

  return {
    title: homeTitle,
    description: homeDescription,
    alternates: localeAlternates("/", locale),
    openGraph: {
      title: `${BRAND_DISPLAY_NAME} — ${homeTitle}`,
      description: homeDescription,
      url: canonical,
      images: homeOgImages(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: `${BRAND_DISPLAY_NAME} — ${homeTitle}`,
      description: homeDescription,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tTools = await getTranslations("tools");
  const grouped = getToolsGrouped();
  const localizedGrouped = grouped.map(({ category, tools }) => ({
    category: {
      ...category,
      title: tTools(`categories.${category.id}.title`) as string,
      description: tTools(`categories.${category.id}.description`) as string,
    },
    tools: tools.map((tool) => ({
      ...tool,
      title: tTools(`items.${tool.id}.title`) as string,
      description: tTools(`items.${tool.id}.description`) as string,
      badge: tTools(`items.${tool.id}.badge`) as string,
    })),
  }));
  const jsonLdItems = localizedGrouped.flatMap(({ tools }) => tools);

  return (
    <div className="flex flex-1 flex-col">
      <HomeJsonLd items={jsonLdItems} locale={locale} name={t("sectionIndex")} />
      <main
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 pb-24 pt-10 sm:pt-14"
        id="main-content"
      >
        {/* 与顶栏 max-w-6xl、工具区同宽，避免「介绍窄一截」 */}
        <section className="w-full max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-gradient-to-br from-[var(--surface-elevated)] via-[var(--surface)] to-[var(--surface-elevated)] p-[1px] shadow-[var(--shadow)]">
            <div className="relative space-y-7 rounded-[31px] glass-panel p-8 sm:p-10">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-faint)]">
                {BRAND_DISPLAY_NAME}
              </p>

              <div className="space-y-5">
                <h1 className="font-display max-w-2xl text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.15rem]">
                  <span className="text-gradient-luxe">{t("heroTitle")}</span>
                  <span className="mt-3 block text-2xl font-semibold text-[var(--text-muted)] sm:text-3xl lg:text-[2.15rem]">
                    {t("heroSubtitle")}
                  </span>
                </h1>

                <div className="max-w-2xl space-y-3 text-pretty text-[15px] leading-7 text-[var(--text-muted)] sm:text-base">
                  <p>
                    <strong className="font-semibold text-[var(--text)]">{BRAND_DISPLAY_NAME}</strong>{" "}
                    {t.rich("heroLead", {
                      ease: (chunks) => <strong className="font-semibold text-[var(--text)]">{chunks}</strong>,
                    })}
                    <Link className="font-medium text-[var(--accent-violet)] underline-offset-4 hover:underline" href="/settings/">
                      {t("readAbout")}
                    </Link>{" "}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)]">
                  Next.js · SSG
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)]">
                  GitHub Pages
                </span>
                <span className="rounded-full border border-[var(--accent-violet)]/35 bg-[var(--accent-violet)]/10 px-3 py-1 font-mono text-[11px] font-medium text-[var(--accent-violet)]">
                  {t("localFirst")}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-10" id="tools">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                  {t("sectionIndex")}
                </h2>
                <span className="rounded-full bg-gradient-to-r from-[var(--accent-violet)]/20 to-[var(--accent)]/20 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-violet)] ring-1 ring-[var(--accent-violet)]/25">
                  {t("sectionIndexBadge")}
                </span>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-[15px]">
                {t("sectionIndexDesc", { brand: BRAND_DISPLAY_NAME })}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 font-mono text-xs text-[var(--text-muted)] shadow-inner ring-1 ring-white/5">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              {t("statsLine", { toolCount, catCount: grouped.length })}
            </div>
          </div>

          <nav aria-label={t("jumpToCategory")} className="-mt-2 flex flex-wrap gap-2">
            {localizedGrouped.map(({ category }) => (
              <a
                key={category.id}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/10 hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                href={`#cat-${category.id}`}
              >
                {category.title}
              </a>
            ))}
          </nav>

          <div className="space-y-14">
            {localizedGrouped.map(({ category, tools: categoryTools }) => (
              <section
                key={category.id}
                aria-labelledby={`heading-${category.id}`}
                className="scroll-mt-28 space-y-5"
                id={`cat-${category.id}`}
              >
                <header className="space-y-1.5 border-b border-[var(--border)]/80 pb-4">
                  <h3
                    className="font-display text-lg font-bold tracking-tight text-[var(--text)] sm:text-xl"
                    id={`heading-${category.id}`}
                  >
                    {category.title}
                  </h3>
                  <p className="max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{category.description}</p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      badge={tool.badge}
                      description={tool.description}
                      featured={tool.featured}
                      featuredLabel={t("featured")}
                      href={tool.href}
                      icon={tool.icon}
                      enterLabel={t("enter")}
                      openLabel={t("open")}
                      title={tool.title}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
