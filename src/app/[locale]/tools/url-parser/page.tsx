"use client";

import { useMemo, useState } from "react";

import { Waypoints } from "lucide-react";
import { useTranslations } from "next-intl";

import { ToolHistoryPanel } from "@/components/tool-history-panel";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "url-parser";

type UrlParseResult =
  | {
      ok: true;
      url: URL;
      queryEntries: Array<[string, string]>;
    }
  | {
      ok: false;
      error: string;
    };

export default function UrlParserPage() {
  const t = useTranslations("toolPages.urlParser");
  const [input, setInput] = useState("https://example.com/path?a=1&b=hello#intro");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const parsed = useMemo<UrlParseResult>(() => {
    const value = input.trim();
    if (!value) {
      return { ok: false, error: "" };
    }
    try {
      const url = new URL(value);
      return { ok: true, url, queryEntries: [...url.searchParams.entries()] };
    } catch {
      return { ok: false, error: t("invalidUrl") };
    }
  }, [input, t]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          toolId={TOOL_ID}
          badge={{ icon: Waypoints, label: "URL · Parser" }}
          breadcrumbLabel="URL 解析器"
          description="解析 URL 的协议、主机、路径、查询参数与片段，便于联调与问题定位。"
          title="URL 解析器"
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="url-parser-input">
                {t("input")}
              </label>
              <textarea
                className={`${TOOL_TEXTAREA_CLASS} min-h-32`}
                id="url-parser-input"
                placeholder={t("placeholder")}
                spellCheck={false}
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </div>

            {!parsed.ok && parsed.error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-900 dark:text-red-100">
                {parsed.error}
              </div>
            ) : null}

            {parsed.ok ? (
              <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5">
                <Row label="href" value={parsed.url.href} />
                <Row label="protocol" value={parsed.url.protocol} />
                <Row label="origin" value={parsed.url.origin} />
                <Row label="host" value={parsed.url.host} />
                <Row label="hostname" value={parsed.url.hostname} />
                <Row label="port" value={parsed.url.port || t("emptyValue")} />
                <Row label="pathname" value={parsed.url.pathname} />
                <Row label="search" value={parsed.url.search || t("emptyValue")} />
                <Row label="hash" value={parsed.url.hash || t("emptyValue")} />

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[var(--text)]">{t("queryParams")}</p>
                  {parsed.queryEntries.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)]">{t("noQueryParams")}</p>
                  ) : (
                    <ul className="space-y-2">
                      {parsed.queryEntries.map(([k, v], index) => (
                        <li
                          key={`${k}-${index}`}
                          className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-3 py-2 font-mono text-xs text-[var(--text)]"
                        >
                          {k} = {v}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
            <ToolHistoryPanel toolId={TOOL_ID} />
          </aside>
        </section>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr] sm:gap-3">
      <div className="font-mono text-xs text-[var(--text-faint)]">{label}</div>
      <div className="break-all font-mono text-sm text-[var(--text)]">{value}</div>
    </div>
  );
}
