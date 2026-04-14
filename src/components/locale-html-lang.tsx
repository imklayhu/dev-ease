"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

export const HTML_LANG: Record<string, string> = {
  zh: "zh-CN",
  en: "en",
};

export function LocaleHtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale] ?? "zh-CN";
  }, [locale]);

  return null;
}
