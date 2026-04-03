import { expect, test } from "@playwright/test";

const locales = ["zh", "en", "ja", "ko"] as const;

test("root redirects to default locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/zh\/$/);
});

for (const locale of locales) {
  test(`core routes render in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator("main")).toBeVisible();

    await page.goto(`/${locale}/settings/`);
    await expect(page.locator("#usage-insights-heading")).toBeVisible();

    await page.goto(`/${locale}/guides/`);
    await expect(page.locator("main h1")).toBeVisible();
  });
}
