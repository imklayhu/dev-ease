This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GitHub Pages（`main` 自动发布）

本仓库使用 **Next.js 静态导出**（`output: "export"`），通过 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) 在 **推送到 `main`** 时构建并部署到 GitHub Pages。

**首次启用：**

1. GitHub 仓库 → **Settings** → **Pages** → **Build and deployment** → **Source** 选 **GitHub Actions**。
2. 合并或推送到 `main` 后，在 **Actions** 中查看运行结果；站点地址一般为 `https://<user>.github.io/dev-ease/`（与 `basePath` 一致）。

本地生产构建（与 CI 一致需设置 `GITHUB_REPOSITORY`）：

```bash
GITHUB_REPOSITORY="$(git config user.name)/dev-ease" npm run build
# 或
GITHUB_REPOSITORY=imklayhu/dev-ease npm run build
```
