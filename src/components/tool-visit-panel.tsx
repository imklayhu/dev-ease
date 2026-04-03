import { useTranslations } from "next-intl";

type ToolVisitPanelProps = {
  visits: number;
  lastVisitedAt: string;
};

export function ToolVisitPanel({ visits, lastVisitedAt }: ToolVisitPanelProps) {
  const t = useTranslations("toolVisit");
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5 shadow-sm shadow-black/5 backdrop-blur-md dark:shadow-black/40">
      <p className="text-sm font-semibold text-[var(--text)]">{t("title")}</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[var(--text-muted)]">{t("visits")}</dt>
          <dd className="font-semibold tabular-nums text-[var(--text)]">{visits}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-[var(--text-muted)]">{t("lastVisit")}</dt>
          <dd className="max-w-[16rem] text-right text-[var(--text)]">
            {lastVisitedAt ? new Date(lastVisitedAt).toLocaleString() : t("firstVisit")}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
        {t("note")}
      </p>
    </div>
  );
}
