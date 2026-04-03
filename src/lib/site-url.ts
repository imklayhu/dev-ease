/**
 * 正式环境的规范域名，用于 canonical、sitemap、OG URL。
 * 构建/部署时通过 NEXT_PUBLIC_SITE_URL 覆盖（勿尾斜杠）。
 */
const PRODUCTION_DEFAULT_ORIGIN = "https://devease.ai-dddd.top";

function normalizeOrigin(raw: string): string {
  return raw.replace(/\/$/, "");
}

const fromEnv = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "");

export const SITE_ORIGIN =
  fromEnv ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_DEFAULT_ORIGIN : "http://localhost:3000");

export function absoluteUrl(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${path}`;
}
