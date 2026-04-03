import type { Metadata } from "next";
import type { ReactNode } from "react";

import { RelatedTools } from "@/components/related-tools";
import { ToolBreadcrumbJsonLd } from "@/components/tool-breadcrumb-json-ld";
import { metadataForTool } from "@/lib/tool-metadata";
import { setRequestLocale } from "next-intl/server";

const TOOL_ID = "sql-formatter" as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return metadataForTool(TOOL_ID, locale);
}

export default async function ToolSegmentLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <ToolBreadcrumbJsonLd toolId={TOOL_ID} locale={locale} />
      {children}
      <div className="mx-auto w-full max-w-6xl border-t border-[var(--border)] px-6 pb-12 pt-8">
        <RelatedTools toolId={TOOL_ID} />
      </div>
    </>
  );
}
