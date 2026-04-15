import { expect, test } from "@playwright/test";

test("PWA manifest is served with correct metadata", async ({ request }) => {
  const resp = await request.get("/manifest.webmanifest");
  expect(resp.status()).toBe(200);
  const manifest = await resp.json();
  expect(manifest.name).toBe("Todo App");
  expect(manifest.short_name).toBe("Todo");
  expect(manifest.display).toBe("standalone");
  expect(manifest.start_url).toBe("/");
  expect(manifest.theme_color).toBe("#0b0b12");
  expect(Array.isArray(manifest.icons)).toBe(true);
  expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
});

test("icons are served", async ({ request }) => {
  for (const path of ["/icon-192.svg", "/icon-512.svg", "/icon-maskable.svg"]) {
    const r = await request.get(path);
    expect(r.status(), path).toBe(200);
    expect(r.headers()["content-type"], path).toContain("image");
  }
});

test("service worker script is served", async ({ request }) => {
  const r = await request.get("/sw.js");
  expect(r.status()).toBe(200);
  const body = await r.text();
  expect(body).toContain("todo-app-v1");
  expect(body).toContain("addEventListener(\"fetch\"");
});

test("manifest link and theme-color are present in HTML head", async ({ page }) => {
  await page.goto("/");
  const manifest = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(manifest).toBeTruthy();
  const theme = await page.locator('meta[name="theme-color"]').first().getAttribute("content");
  expect(theme).toBe("#0b0b12");
});

test("tags: create, assign to task, filter, delete cascades", async ({ page }) => {
  const tagName = `wk${Date.now().toString().slice(-6)}`;
  const taskTitle = `tagged-${Date.now()}`;

  await page.goto("/tags");
  await page.getByPlaceholder("e.g. work, personal, urgent").fill(tagName);
  await page.getByRole("button", { name: "Add tag" }).click();
  await expect(page.getByText(`#${tagName}`).first()).toBeVisible();

  await page.goto("/");
  await page.getByPlaceholder("What needs doing?").fill(taskTitle);
  await page.locator('input[name="dueAt"]').fill(future(60));
  await page.locator("fieldset label", { hasText: `#${tagName}` }).click();
  await page.getByRole("button", { name: "Add" }).click();

  const row = page.locator("li", { hasText: taskTitle });
  await expect(row).toBeVisible();
  await expect(row.getByText(`#${tagName}`)).toBeVisible();

  // filter by tag
  await page
    .getByRole("link", { name: `#${tagName}`, exact: true })
    .first()
    .click();
  await expect(page.locator("li", { hasText: taskTitle })).toBeVisible();

  // cascade: delete tag, task survives without tag
  await page.goto("/tags");
  await page
    .locator("li", { hasText: `#${tagName}` })
    .getByRole("button", { name: `Delete tag ${tagName}` })
    .click();
  await expect(page.locator("li", { hasText: `#${tagName}` })).toHaveCount(0);

  await page.goto("/");
  await expect(page.locator("li", { hasText: taskTitle })).toBeVisible();
});

function future(minutes: number): string {
  const d = new Date(Date.now() + minutes * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
