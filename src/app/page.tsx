import { redirect } from "next/navigation";

/** 与 `routing.localePrefix: "always"` 一致：默认进入中文 */
export default function RootRedirectPage() {
  redirect("/zh/");
}
