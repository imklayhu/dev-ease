type ToolVisitPanelProps = {
  visits: number;
  lastVisitedAt: string;
};

export function ToolVisitPanel({ visits, lastVisitedAt }: ToolVisitPanelProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-5 shadow-sm shadow-black/5 backdrop-blur-md dark:shadow-black/40">
      <p className="text-sm font-semibold text-[var(--text)]">本地访问记录</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[var(--text-muted)]">访问次数</dt>
          <dd className="font-semibold tabular-nums text-[var(--text)]">{visits}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-[var(--text-muted)]">上次访问</dt>
          <dd className="max-w-[16rem] text-right text-[var(--text)]">
            {lastVisitedAt ? new Date(lastVisitedAt).toLocaleString() : "首次访问"}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
        仅保存在本机浏览器（IndexedDB），不会上传服务器。
      </p>
    </div>
  );
}
