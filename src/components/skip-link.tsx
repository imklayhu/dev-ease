export function SkipLink() {
  return (
    <a
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--accent-foreground)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
      href="#main-content"
    >
      跳到主要内容
    </a>
  );
}
