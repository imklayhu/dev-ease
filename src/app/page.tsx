import {
  Binary,
  Braces,
  Clock,
  Fingerprint,
  Gauge,
  Hash,
  Link2,
  Palette,
  Regex,
} from "lucide-react";

import { ToolCard } from "@/components/tool-card";
import { BRAND_DISPLAY_NAME } from "@/lib/brand";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 pb-24 pt-10 sm:pt-14"
        id="main-content"
      >
        {/* 与顶栏 max-w-6xl、工具区同宽，避免「介绍窄一截」 */}
        <section className="w-full max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-gradient-to-br from-[var(--surface-elevated)] via-[var(--surface)] to-[var(--surface-elevated)] p-[1px] shadow-[var(--shadow)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent-violet)]/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[var(--accent-fuchsia)]/20 blur-3xl"
            />

            <div className="relative space-y-7 rounded-[31px] glass-panel p-8 sm:p-10">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-faint)]">
                {BRAND_DISPLAY_NAME}
              </p>

              <div className="space-y-5">
                <h1 className="font-display max-w-2xl text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.15rem]">
                  <span className="text-gradient-luxe">常用开发小工具</span>
                  <span className="mt-3 block text-2xl font-semibold text-[var(--text-muted)] sm:text-3xl lg:text-[2.15rem]">
                    收进一处，随手可用
                  </span>
                </h1>

                <div className="max-w-2xl space-y-3 text-pretty text-[15px] leading-7 text-[var(--text-muted)] sm:text-base">
                  <p>
                    <strong className="font-semibold text-[var(--text)]">{BRAND_DISPLAY_NAME}</strong>{" "}
                    面向开发者与日常效率场景：把 JSON、Base64、时间戳、哈希等常用能力放进一个纯前端、无需登录的静态站点。名字里的{" "}
                    <strong className="font-semibold text-[var(--text)]">Ease</strong> 取「轻松、顺手」之意——让格式化、校验、编解码这类琐事在浏览器里快速完成。
                  </p>
                  <p>
                    页面在本地运行；偏好与访问次数默认写进 IndexedDB，没有账号、也不把内容同步到云端。技术栈与部署说明见{" "}
                    <a className="font-medium text-[var(--accent-violet)] underline-offset-4 hover:underline" href="/settings/">
                      关于我们
                    </a>
                    。
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)]">
                  Next.js · SSG
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)]">
                  GitHub Pages
                </span>
                <span className="rounded-full border border-[var(--accent-violet)]/35 bg-[var(--accent-violet)]/10 px-3 py-1 font-mono text-[11px] font-medium text-[var(--accent-violet)]">
                  本地优先
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8" id="tools">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                  工具索引
                </h2>
                <span className="rounded-full bg-gradient-to-r from-[var(--accent-violet)]/20 to-[var(--accent)]/20 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-violet)] ring-1 ring-[var(--accent-violet)]/25">
                  Bento
                </span>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-[15px]">
                {BRAND_DISPLAY_NAME} 当前收录的工具如下。点进卡片即可使用
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 font-mono text-xs text-[var(--text-muted)] shadow-inner ring-1 ring-white/5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)] motion-reduce:animate-none" />
              共 <span className="font-semibold text-[var(--text)]">9</span> 款
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ToolCard
              badge="JSON"
              description="校验 JSON；格式化（两格缩进）或压缩成一行。"
              featured
              href="/tools/json-formatter/"
              icon={Braces}
              title="JSON 格式化 / 压缩"
            />
            <ToolCard
              badge="文本"
              description="统计字符、单词、行数；访问次数只在本地累计。"
              href="/tools/text-counter/"
              icon={Gauge}
              title="文本计数器"
            />
            <ToolCard
              badge="编码"
              description="Base64 编解码，UTF-8 文本不走样。"
              href="/tools/base64/"
              icon={Binary}
              title="Base64 编解码"
            />
            <ToolCard
              badge="时间"
              description="Unix 时间戳与可读时间互转；支持秒/毫秒。"
              href="/tools/timestamp/"
              icon={Clock}
              title="时间戳转换"
            />
            <ToolCard
              badge="随机"
              description="批量生成 UUID v4。"
              href="/tools/uuid/"
              icon={Fingerprint}
              title="UUID 生成器"
            />
            <ToolCard
              badge="URL"
              description="encodeURIComponent / decodeURIComponent。"
              href="/tools/url-codec/"
              icon={Link2}
              title="URL 组件编解码"
            />
            <ToolCard
              badge="哈希"
              description="SHA-256 / 384 / 512；输出 hex。"
              href="/tools/crypto-hash/"
              icon={Hash}
              title="文本哈希（SHA）"
            />
            <ToolCard
              badge="正则"
              description="调试正则：列出匹配与捕获组。"
              href="/tools/regex-tester/"
              icon={Regex}
              title="正则测试"
            />
            <ToolCard
              badge="颜色"
              description="HEX / RGB / HSL 互转，带预览。"
              href="/tools/color-converter/"
              icon={Palette}
              title="颜色转换"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
