"use client";

import { useMemo, useState } from "react";

import { Shield } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { ToolPageHeader } from "@/components/tool-page-header";
import { ToolVisitPanel } from "@/components/tool-visit-panel";
import { useToolVisit } from "@/hooks/use-tool-visit";
import { TOOL_TEXTAREA_CLASS } from "@/lib/tool-ui";

const TOOL_ID = "jwt-inspector";

function decodeJwtPart(part: string): unknown {
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padLen);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json) as unknown;
}

export default function JwtInspectorPage() {
  const [input, setInput] = useState("");
  const { visits, lastVisitedAt } = useToolVisit(TOOL_ID);

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { ok: true as const, header: null as unknown, payload: null as unknown, signature: "", error: "" };
    }
    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      return { ok: false as const, header: null, payload: null, signature: "", error: "JWT 应包含三段：header.payload.signature" };
    }
    try {
      const header = decodeJwtPart(parts[0]!);
      const payload = decodeJwtPart(parts[1]!);
      return { ok: true as const, header, payload, signature: parts[2]!, error: "" };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "解析失败";
      return { ok: false as const, header: null, payload: null, signature: "", error: msg };
    }
  }, [input]);

  const headerStr = result.ok && result.header !== null ? JSON.stringify(result.header, null, 2) : "";
  const payloadStr = result.ok && result.payload !== null ? JSON.stringify(result.payload, null, 2) : "";

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pb-16 pt-8" id="main-content">
        <ToolPageHeader
          badge={{ icon: Shield, label: "JWT · 仅解码" }}
          breadcrumbLabel="JWT 解析"
          description="在浏览器内 Base64URL 解码 header 与 payload，便于排查令牌内容。不会验证签名，也不能代替服务端校验。"
          title="JWT 解析"
        />

        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]" htmlFor="jwt-in">
                粘贴 JWT
              </label>
              <textarea
                className={`${TOOL_TEXTAREA_CLASS} min-h-32`}
                id="jwt-in"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {result.error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-900 dark:text-red-100">
                {result.error}
              </div>
            ) : null}

            {result.ok && result.header !== null ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--text)]">Header</p>
                    <CopyButton label="复制" text={headerStr} />
                  </div>
                  <textarea className={`${TOOL_TEXTAREA_CLASS} min-h-40`} readOnly value={headerStr} />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--text)]">Payload</p>
                    <CopyButton label="复制" text={payloadStr} />
                  </div>
                  <textarea className={`${TOOL_TEXTAREA_CLASS} min-h-40`} readOnly value={payloadStr} />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <p className="text-sm font-semibold text-[var(--text)]">Signature（原始片段，未验证）</p>
                  <p className="break-all rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3 font-mono text-xs text-[var(--text-muted)]">
                    {result.signature}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <ToolVisitPanel lastVisitedAt={lastVisitedAt} visits={visits} />
        </section>
      </main>
    </div>
  );
}
