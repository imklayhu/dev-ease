export type GuideItem = {
  slug: string;
  title: string;
  description: string;
  /** ISO 日期 */
  date: string;
};

/** 站内指南（静态页），新文章在此登记并在 sitemap 中同步 */
export const guides: GuideItem[] = [
  {
    slug: "local-first-json-workflow",
    title: "本地优先：为什么 JSON 在浏览器里处理更安心",
    description: "联调、隐私与离线场景下，在浏览器内完成 JSON 解析与排版的意义，以及如何与 DevEase 的工具配合。",
    date: "2026-04-03",
  },
];

export function getGuideBySlug(slug: string): GuideItem | undefined {
  return guides.find((g) => g.slug === slug);
}
