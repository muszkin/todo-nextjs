import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("loads with title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Todo App");
    await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
  });

  test("can add, mark done, and delete a task", async ({ page }) => {
    await page.goto("/");

    const title = `e2e ${Date.now()}`;
    const due = futureDateTimeLocal(5);

    await page.getByPlaceholder("What needs doing?").fill(title);
    await page.locator('input[name="dueAt"]').fill(due);
    await page.getByRole("button", { name: "Add" }).click();

    const row = page.locator("li", { hasText: title });
    await expect(row).toBeVisible();

    await row.getByRole("button", { name: "Mark done" }).click();
    await expect(row.getByText("done", { exact: true })).toBeVisible();

    await row.getByRole("button", { name: "Delete" }).click();
    await expect(row).toHaveCount(0);
  });

  test("alarm fires for task due in seconds", async ({ page }) => {
    await page.goto("/");

    const title = `alarm ${Date.now()}`;
    const due = futureDateTimeLocal(0, 3);

    await page.getByPlaceholder("What needs doing?").fill(title);
    await page.locator('input[name="dueAt"]').fill(due);
    await page.getByRole("button", { name: "Add" }).click();

    await expect(page.locator("li", { hasText: title })).toBeVisible();

    const alert = page.getByRole("alert").filter({ hasText: title });
    await expect(alert).toBeVisible({ timeout: 15_000 });
  });
});

function futureDateTimeLocal(minutes: number, seconds = 0): string {
  const d = new Date(Date.now() + minutes * 60_000 + seconds * 1_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
