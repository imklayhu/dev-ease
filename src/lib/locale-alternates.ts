import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site-url";

/** hreflang 与站点 locale 对应（与 OG locale 一致） */
const HREFLANG: Record<string, string> = {
  zh: "zh-CN",
  en: "en",
  ja: "ja",
  ko: "ko",
};

/**
 * 多语言 SEO：canonical + hreflang（含 x-default 指向默认语言首页）。
 * `path` 为站内路径（不含 locale），如 `/`、`/settings/`、`/tools/json-formatter/`。
 */
export function localeAlternates(
  path: string,
  locale: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[HREFLANG[loc] ?? loc] = absoluteUrl(path, loc);
  }
  languages["x-default"] = absoluteUrl(path, routing.defaultLocale);
  return {
    canonical: absoluteUrl(path, locale),
    languages,
  };
}
