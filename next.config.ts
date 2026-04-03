import type { NextConfig } from "next";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isProd = process.env.NODE_ENV === "production";

/**
 * GitHub Pages 项目站默认是 user.github.io/repo/，需要 basePath。
 * 绑定自定义域名后内容在域名根路径，资源应为 /_next/...，不能带 /repo/。
 * CI 设置 NEXT_STATIC_SITE_ROOT=true 关闭子路径（见 deploy-pages 工作流）。
 */
const siteAtDomainRoot =
  process.env.NEXT_STATIC_SITE_ROOT === "1" ||
  process.env.NEXT_STATIC_SITE_ROOT === "true";
const useRepoSubpath = isProd && Boolean(repoName) && !siteAtDomainRoot;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: useRepoSubpath ? `/${repoName}` : "",
  assetPrefix: useRepoSubpath ? `/${repoName}/` : undefined,
};

export default nextConfig;
