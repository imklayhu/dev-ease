/**
 * 正式环境的规范域名，用于 canonical、sitemap、OG URL。
 * 构建/部署时通过 NEXT_PUBLIC_SITE_URL 覆盖（勿尾斜杠）。
 */
import { routing } from "@/i18n/routing";

const PRODUCTION_DEFAULT_ORIGIN = "https://devease.ai-dddd.top";

function normalizeOrigin(raw: string): string {
  return raw.replace(/\/$/, "");
}

const fromEnv = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "");

export const SITE_ORIGIN =
  fromEnv ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_DEFAULT_ORIGIN : "http://localhost:3000");

/**
 * 带语言前缀的绝对 URL（与 `localePrefix: "always"` 一致）。
 * `path` 为站点内路径（不含 locale），如 `/`、`/tools/json-formatter/`。
 */
export function absoluteUrl(path: string, locale: string = routing.defaultLocale): string {
  if (path.includes("#")) {
    const [pathPart, hash] = path.split("#");
    const base = absoluteUrl(pathPart || "/", locale);
    return `${base}#${hash}`;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withLocale =
    normalized === "/" ? `/${locale}/` : `/${locale}${normalized}`.replace(/\/{2,}/g, "/");
  return `${SITE_ORIGIN}${withLocale}`.replace(/([^:]\/)\/+/g, "$1");
}
