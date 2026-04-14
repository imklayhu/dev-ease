import { expect, test } from "@playwright/test";

const LOCALES = ["zh", "en"] as const;

test.describe("i18n full-site regression", () => {
  for (const locale of LOCALES) {
    test(`${locale}: home/settings/guides render`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      await expect(page.locator("main")).toBeVisible();

      await page.goto(`/${locale}/settings/`);
      await expect(page.locator("main")).toBeVisible();

      await page.goto(`/${locale}/guides/`);
      await expect(page.locator("main")).toBeVisible();
    });

    test(`${locale}: representative tools render`, async ({ page }) => {
      await page.goto(`/${locale}/tools/markdown-preview/`);
      await expect(page.locator("#md-input")).toBeVisible();

      await page.goto(`/${locale}/tools/cron-parser/`);
      await expect(page.locator("#cron-input")).toBeVisible();

      await page.goto(`/${locale}/tools/sql-formatter/`);
      await expect(page.locator("#sql-input")).toBeVisible();

      await page.goto(`/${locale}/tools/qr-decode/`);
      await expect(page.locator("#qr-decode-file")).toBeAttached();
    });
  }
});
