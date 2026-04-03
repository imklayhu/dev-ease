"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { getRelatedTools } from "@/data/tools";

type RelatedToolsProps = {
  toolId: string;
};

export function RelatedTools({ toolId }: RelatedToolsProps) {
  const t = useTranslations("relatedTools");
  const related = getRelatedTools(toolId);
  if (related.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-tools-heading" className="scroll-mt-24">
      <h2
        className="font-display text-lg font-bold tracking-tight text-[var(--text)] sm:text-xl"
        id="related-tools-heading"
      >
        {t("title")}
      </h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{t("desc")}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2" role="list">
        {related.map((tool) => (
          <li key={tool.id}>
            <Link
              className="group flex items-start justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-4 text-left shadow-sm shadow-black/5 outline-none ring-offset-2 ring-offset-[var(--surface)] transition hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/8 focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:shadow-black/40"
              href={tool.href}
            >
              <div className="min-w-0">
                <p className="font-semibold text-[var(--text)]">{tool.title}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{tool.description}</p>
              </div>
              <ArrowUpRight
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-faint)] transition group-hover:text-[var(--accent-violet)]"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
