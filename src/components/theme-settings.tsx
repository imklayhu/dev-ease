"use client";

import { useEffect, useState } from "react";

import type { LucideIcon } from "lucide-react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  getThemeSetting,
  isIndexedDbAvailable,
  setThemeSetting,
  type ThemeMode,
} from "@/lib/db/client";

const themeOptions: Array<{ mode: ThemeMode; icon: LucideIcon }> = [
  { mode: "system", icon: Monitor },
  { mode: "light", icon: Sun },
  { mode: "dark", icon: Moon },
];

const applyTheme = (mode: ThemeMode): void => {
  const root = document.documentElement;

  root.dataset.theme = mode;

  if (mode === "system") {
    root.style.colorScheme = "light dark";
    return;
  }

  root.style.colorScheme = mode;
};

type ThemeSettingsProps = {
  embedded?: boolean;
  /**
   * `minimal`：用于 Drawer 等容器内（外层已提供标题），隐藏重复标题与卡片外壳。
   */
  variant?: "default" | "minimal";
};

export function ThemeSettings({ embedded = false, variant = "default" }: ThemeSettingsProps) {
  const t = useTranslations("theme");
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [warning, setWarning] = useState<string>("");

  useEffect(() => {
    let active = true;

    (async () => {
      const savedTheme = await getThemeSetting();
      if (!active) {
        return;
      }

      setTheme(savedTheme);
      applyTheme(savedTheme);

      if (!isIndexedDbAvailable()) {
        setWarning(t("warningNoIdb"));
      }
    })();

    return () => {
      active = false;
    };
  }, [t]);

  const onChange = async (mode: ThemeMode) => {
    setTheme(mode);
    applyTheme(mode);
    await setThemeSetting(mode);
  };

  const isMinimal = variant === "minimal";

  return (
    <section
      className={
        isMinimal
          ? "space-y-4"
          : embedded
            ? "space-y-4"
            : "rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-6 shadow-sm shadow-black/5 backdrop-blur-md dark:shadow-black/40"
      }
    >
      {isMinimal ? (
        <div className="space-y-1">
          <h3 className="font-display text-sm font-bold tracking-tight text-[var(--text)]">{t("modeAria")}</h3>
          <p className="text-xs leading-5 text-[var(--text-muted)]">{t("minimalDesc")}</p>
        </div>
      ) : (
        <div className="space-y-1">
          <h2 className="font-display text-lg font-bold tracking-tight text-[var(--text)]">{t("title")}</h2>
          <p className="text-sm leading-6 text-[var(--text-muted)]">{t("desc")}</p>
        </div>
      )}

      <div
        aria-label={t("modeAria")}
        className={`grid gap-2 ${isMinimal ? "grid-cols-1" : "sm:grid-cols-3"}`}
        role="radiogroup"
      >
        {themeOptions.map((option) => {
          const selected = theme === option.mode;
          const Icon = option.icon;

          return (
            <button
              key={option.mode}
              aria-checked={selected}
              className={`cursor-pointer rounded-2xl border text-left outline-none ring-offset-2 ring-offset-[var(--surface)] transition duration-200 focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                selected
                  ? "border-transparent bg-gradient-to-br from-[var(--accent-violet)]/20 via-[var(--accent-fuchsia)]/12 to-[var(--accent)]/18 p-[1px] shadow-[var(--glow)]"
                  : "border-[var(--border)] bg-[var(--surface-elevated)]/70 px-3 py-3 hover:border-[var(--accent-violet)]/35 hover:bg-[var(--accent-violet)]/5"
              }`}
              role="radio"
              type="button"
              onClick={() => onChange(option.mode)}
            >
              <div
                className={`flex items-start gap-3 ${selected ? "rounded-[15px] border border-[var(--border-strong)]/80 bg-[var(--surface-elevated)]/90 p-3" : ""}`}
              >
                <span
                  className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${
                    selected
                      ? "bg-gradient-to-br from-[var(--accent-violet)]/30 to-[var(--accent)]/20 text-[var(--accent)] ring-[var(--accent-violet)]/35"
                      : "bg-[var(--surface-subtle)] text-[var(--text-muted)] ring-[var(--border)]"
                  }`}
                >
                  <Icon aria-hidden className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[var(--text)]">{t(`options.${option.mode}.label`)}</span>
                  <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                    {t(`options.${option.mode}.description`)}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {warning ? (
        <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-950 dark:text-amber-100">
          {warning}
        </p>
      ) : null}
    </section>
  );
}
