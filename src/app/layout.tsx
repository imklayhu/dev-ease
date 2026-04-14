import type { ReactNode } from "react";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";

import "./globals.css";

const fontSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const fontDisplay = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`h-full antialiased ${fontSans.variable} ${fontMono.variable} ${fontDisplay.variable}`}
      data-theme="system"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
