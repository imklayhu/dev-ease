import { BRAND_DISPLAY_NAME } from "@/lib/brand";

/** 静态 OG 图（public/og.png，1200×630） */
export const OG_IMAGE_PATH = "/og.png" as const;

export const OG_IMAGE_DIMENSIONS = { width: 1200, height: 630 } as const;

const OG_ALT: Record<string, (brand: string) => string> = {
  zh: (brand) => `${brand} — 开发者在线工具集合`,
  en: (brand) => `${brand} — developer online tools`,
  ja: (brand) => `${brand} — 開発者向けオンラインツール`,
  ko: (brand) => `${brand} — 개발자 온라인 도구 모음`,
};

/** 工具页 meta 缺省描述的后缀文案，与各语言文案表语义对齐 */
const TOOL_FALLBACK_SUFFIX: Record<string, string> = {
  zh: "纯前端在线工具，无需登录；数据在浏览器本地处理。",
  en: "Pure front-end browser tool; no login; data stays local in your browser.",
  ja: "純粋なフロントエンドのブラウザツール。ログイン不要。データはローカルで処理。",
  ko: "순수 프론트엔드 브라우저 도구. 로그인 불필요. 데이터는 로컬에서 처리됩니다.",
};

export function ogImageAltForLocale(locale: string, brand: string = BRAND_DISPLAY_NAME): string {
  return (OG_ALT[locale] ?? OG_ALT.en)(brand);
}

export function ogImageAlt(): string {
  return ogImageAltForLocale("zh");
}

export function toolSeoFallbackSuffix(locale: string): string {
  return TOOL_FALLBACK_SUFFIX[locale] ?? TOOL_FALLBACK_SUFFIX.en;
}
