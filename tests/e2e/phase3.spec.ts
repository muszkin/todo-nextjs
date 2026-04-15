import { expect, test } from "@playwright/test";

test("filters by status", async ({ page }) => {
  const a = `filterA-${Date.now()}`;
  const b = `filterB-${Date.now()}`;

  await page.goto("/");
  await page.getByPlaceholder("What needs doing?").fill(a);
  await page.locator('input[name="dueAt"]').fill(future(60));
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator("li", { hasText: a })).toBeVisible();

  await page.getByPlaceholder("What needs doing?").fill(b);
  await page.locator('input[name="dueAt"]').fill(future(120));
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator("li", { hasText: b })).toBeVisible();

  await page.locator("li", { hasText: a }).getByRole("button", { name: "Mark done" }).click();
  await expect(
    page.locator("li", { hasText: a }).locator("span").filter({ hasText: "done" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "todo", exact: true }).click();
  await expect(page.locator("li", { hasText: a })).toHaveCount(0);
  await expect(page.locator("li", { hasText: b })).toBeVisible();

  await page.getByRole("link", { name: "done", exact: true }).click();
  await expect(page.locator("li", { hasText: a })).toBeVisible();
  await expect(page.locator("li", { hasText: b })).toHaveCount(0);
});

test("recurring task spawns next instance on done", async ({ page }) => {
  const title = `recur-${Date.now()}`;

  await page.goto("/");
  await page.getByPlaceholder("What needs doing?").fill(title);
  await page.locator('input[name="dueAt"]').fill(future(60));
  await page.locator('select[name="recurrence"]').selectOption("daily");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.locator("li", { hasText: title })).toHaveCount(1);
  await expect(page.locator("li", { hasText: title }).getByText("↻ daily")).toBeVisible();

  await page
    .locator("li", { hasText: title })
    .first()
    .getByRole("button", { name: "Mark done" })
    .click();

  await expect(page.locator("li", { hasText: title })).toHaveCount(2);
});

test("export endpoint returns JSON download", async ({ page, request }) => {
  await page.goto("/");
  const title = `export-${Date.now()}`;
  await page.getByPlaceholder("What needs doing?").fill(title);
  await page.locator('input[name="dueAt"]').fill(future(60));
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator("li", { hasText: title })).toBeVisible();

  const resp = await request.get("/api/export");
  expect(resp.status()).toBe(200);
  expect(resp.headers()["content-type"]).toContain("application/json");
  expect(resp.headers()["content-disposition"]).toContain("attachment");
  const body = await resp.json();
  expect(body.version).toBe(2);
  expect(Array.isArray(body.tasks)).toBe(true);
  expect(body.tasks.some((t: { title: string }) => t.title === title)).toBe(true);
});

function future(minutes: number): string {
  const d = new Date(Date.now() + minutes * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
