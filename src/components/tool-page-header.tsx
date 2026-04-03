"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { getCategoryForTool } from "@/data/tools";

type ToolPageHeaderProps = {
  title: string;
  description: string;
  breadcrumbLabel: string;
  /** 传入后与结构化数据 BreadcrumbList 一致：首页 / 分类 / 当前工具 */
  toolId?: string;
  backHref?: string;
  badge?: { icon: LucideIcon; label: string };
};

export function ToolPageHeader({
  title,
  description,
  breadcrumbLabel,
  toolId,
  backHref = "/#tools",
  badge,
}: ToolPageHeaderProps) {
  const t = useTranslations("nav");
  const tTools = useTranslations("tools");
  const BadgeIcon = badge?.icon;
  const category = toolId ? getCategoryForTool(toolId) : undefined;

  const localizedTitle = toolId ? (tTools(`items.${toolId}.title`) as string) : title;
  const localizedDescription = toolId
    ? (tTools(`items.${toolId}.description`) as string)
    : description;
  const localizedBreadcrumbLabel = toolId ? localizedTitle : breadcrumbLabel;
  const localizedBadgeLabel =
    toolId && tTools
      ? ((tTools(`items.${toolId}.badge`) as string) ?? badge?.label)
      : badge?.label;
  const localizedCategoryTitle =
    category && tTools ? ((tTools(`categories.${category.id}.title`) as string) ?? category.title) : category?.title;

  return (
    <>
      <nav aria-label={t("breadcrumbAria")} className="text-sm text-[var(--text-muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              className="cursor-pointer rounded-md font-medium text-[var(--accent-violet)] underline-offset-4 transition hover:text-[var(--text)] hover:underline"
              href="/"
            >
              {t("home")}
            </Link>
          </li>
          {category ? (
            <>
              <li aria-hidden className="text-[var(--text-muted)]/70">
                /
              </li>
              <li>
                <Link
                  className="cursor-pointer rounded-md font-medium text-[var(--accent-violet)] underline-offset-4 transition hover:text-[var(--text)] hover:underline"
                  href={`/#cat-${category.id}`}
                >
                  {localizedCategoryTitle}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden className="text-[var(--text-muted)]/70">
            /
          </li>
          <li className="text-[var(--text)]">{localizedBreadcrumbLabel}</li>
        </ol>
      </nav>

      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          {badge && BadgeIcon ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-violet)]/25 bg-gradient-to-r from-[var(--accent-violet)]/12 to-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--text-muted)] ring-1 ring-[var(--border)]">
              <BadgeIcon aria-hidden className="h-4 w-4 text-[var(--accent-violet)]" />
              {localizedBadgeLabel}
            </div>
          ) : null}

          <div className="space-y-2">
            <h1 className="font-display text-balance text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
              {localizedTitle}
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              {localizedDescription}
            </p>
          </div>
        </div>

        <Link
          className="inline-flex cursor-pointer items-center justify-center gap-2 self-start rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 px-4 py-2.5 text-sm font-semibold text-[var(--text)] shadow-[var(--shadow)] outline-none ring-offset-2 ring-offset-[var(--surface)] backdrop-blur-sm transition duration-200 hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/10 focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          href={backHref}
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          {t("backToTools")}
        </Link>
      </header>
    </>
  );
}
