import { BRAND_DISPLAY_NAME } from "@/lib/brand";

/** 静态 OG 图（`public/og.png`，1200×630） */
export const OG_IMAGE_PATH = "/og.png" as const;

export const OG_IMAGE_DIMENSIONS = { width: 1200, height: 630 } as const;

export function ogImageAlt(): string {
  return `${BRAND_DISPLAY_NAME} — 开发者在线工具集合`;
}
