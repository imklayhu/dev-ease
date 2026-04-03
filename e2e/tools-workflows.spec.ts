import { expect, test } from "@playwright/test";

test.describe("tool workflows", () => {
  test("json formatter", async ({ page }) => {
    await page.goto("/zh/tools/json-formatter/");
    await page.fill("#json-input", '{"a":1,"b":[2,3]}');
    await expect(page.locator("textarea[readonly]").first()).toContainText('"a": 1');
  });

  test("uuid generator", async ({ page }) => {
    await page.goto("/zh/tools/uuid/");
    await page.fill("#uuid-count", "3");
    await page.getByRole("button", { name: /生成|Generate|再生成/ }).first().click();
    await expect(page.locator("code").first()).toHaveText(/[0-9a-f]{8}-/i);
  });

  test("base64 codec", async ({ page }) => {
    await page.goto("/zh/tools/base64/");
    await page.fill("#b64-input", "DevEase");
    await expect(page.locator("textarea[readonly]")).toContainText("RGV2RWFzZQ==");
  });

  test("timestamp converter", async ({ page }) => {
    await page.goto("/zh/tools/timestamp/");
    await page.fill("#ts-input", "1712131200");
    await expect(page.getByText("ISO", { exact: false })).toBeVisible();
  });

  test("text counter", async ({ page }) => {
    await page.goto("/zh/tools/text-counter/");
    await page.fill("#text-input", "hello world\nline2");
    await expect(page.locator("dd").first()).not.toHaveText("0");
  });

  test("text diff", async ({ page }) => {
    await page.goto("/zh/tools/text-diff/");
    await page.fill("#diff-a", "a\nb");
    await page.fill("#diff-b", "a\nc");
    await expect(page.locator("pre")).toContainText("c");
  });

  test("password generator", async ({ page }) => {
    await page.goto("/zh/tools/password-generator/");
    await page.locator("button[type='button']").first().click();
    await expect(page.locator("main")).toContainText(/.{8,}/);
  });

  test("jwt inspector", async ({ page }) => {
    await page.goto("/zh/tools/jwt-inspector/");
    await page.fill("#jwt-in", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature");
    await expect(page.locator("main")).toContainText("sub");
  });

  test("unicode inspector", async ({ page }) => {
    await page.goto("/zh/tools/unicode-inspector/");
    await page.fill("#uni-in", "A🎉");
    await expect(page.locator("table tbody tr")).toHaveCount(2);
  });

  test("url codec", async ({ page }) => {
    await page.goto("/zh/tools/url-codec/");
    await page.fill("#url-input", "a b");
    await expect(page.locator("textarea[readonly]")).toContainText("a%20b");
  });

  test("html entities", async ({ page }) => {
    await page.goto("/zh/tools/html-entities/");
    await page.fill("#html-in", "<div>&</div>");
    await expect(page.locator("textarea[readonly]")).toContainText("&lt;div&gt;&amp;&lt;/div&gt;");
  });

  test("crypto hash", async ({ page }) => {
    await page.goto("/zh/tools/crypto-hash/");
    await page.fill("#hash-input", "abc");
    await expect(page.locator("textarea[readonly]")).toHaveText(/[a-f0-9]{64,128}/);
  });

  test("color converter", async ({ page }) => {
    await page.goto("/zh/tools/color-converter/");
    await page.fill("#color-input", "#22c55e");
    await expect(page.locator("main")).toContainText("rgb(34, 197, 94)");
  });

  test("qr code", async ({ page }) => {
    await page.goto("/zh/tools/qr-code/");
    await page.fill("#qr-text", "https://example.com");
    await expect(page.locator("img")).toBeVisible();
  });

  test("regex tester", async ({ page }) => {
    await page.goto("/zh/tools/regex-tester/");
    await page.fill("#re-pattern", "\\d+");
    await page.fill("#re-flags", "g");
    await page.fill("#re-text", "a1 b22");
    await expect(page.locator("main")).toContainText("22");
  });

  test("markdown preview", async ({ page }) => {
    await page.goto("/zh/tools/markdown-preview/");
    await page.fill("#md-input", "# hello\n\n**world**");
    await expect(page.locator("article h1")).toContainText("hello");
    await expect(page.locator("article strong")).toContainText("world");
  });

  test("url parser", async ({ page }) => {
    await page.goto("/zh/tools/url-parser/");
    await page.fill("#url-parser-input", "https://example.com/a?x=1#y");
    await expect(page.locator("main")).toContainText("protocol");
    await expect(page.locator("main")).toContainText("x = 1");
  });
});
