import { expect, test } from "@playwright/test";

test.describe("owners", () => {
  test("create owner, see badge on a task, delete owner", async ({ page }) => {
    const ownerName = `Anna-${Date.now()}`;
    const taskTitle = `joint ${Date.now()}`;

    await page.goto("/owners");
    await page.getByPlaceholder("Owner name").fill(ownerName);
    await page.locator('select[name="color"]').selectOption("mint");
    await page.getByRole("button", { name: "Add owner" }).click();

    await expect(page.locator("li", { hasText: ownerName })).toBeVisible();

    await page.goto("/");
    await page.getByPlaceholder("What needs doing?").fill(taskTitle);
    await page.locator('input[name="dueAt"]').fill(futureDateTimeLocal(60));
    await page.locator("fieldset label", { hasText: ownerName }).click();
    await page.getByRole("button", { name: "Add" }).click();

    const row = page.locator("li", { hasText: taskTitle });
    await expect(row).toBeVisible();
    await expect(row.getByText(ownerName)).toBeVisible();

    await page.goto("/owners");
    await page
      .locator("li", { hasText: ownerName })
      .getByRole("button", { name: "Delete owner" })
      .click();
    await expect(page.locator("li", { hasText: ownerName })).toHaveCount(0);

    await page.goto("/");
    await expect(page.locator("li", { hasText: taskTitle })).toBeVisible();
    await expect(
      page.locator("li", { hasText: taskTitle }).getByText(ownerName),
    ).toHaveCount(0);

    await page
      .locator("li", { hasText: taskTitle })
      .getByRole("button", { name: "Delete" })
      .click();
  });
});

test.describe("calendar", () => {
  test("renders current month with task pip", async ({ page }) => {
    const taskTitle = `cal ${Date.now()}`;

    await page.goto("/");
    await page.getByPlaceholder("What needs doing?").fill(taskTitle);
    await page.locator('input[name="dueAt"]').fill(futureDateTimeLocal(60));
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.locator("li", { hasText: taskTitle })).toBeVisible();

    await page.goto("/calendar");
    await expect(page.getByRole("heading", { name: "Calendar" })).toBeVisible();
    await expect(page.getByText(taskTitle)).toBeVisible();

    // navigate next month and back
    await page.getByRole("link", { name: "next →" }).click();
    await expect(page.getByText(taskTitle)).toHaveCount(0);
    await page.getByRole("link", { name: "today" }).click();
    await expect(page.getByText(taskTitle)).toBeVisible();

    // cleanup
    await page.goto("/");
    await page
      .locator("li", { hasText: taskTitle })
      .getByRole("button", { name: "Delete" })
      .click();
  });
});

function futureDateTimeLocal(minutes: number): string {
  const d = new Date(Date.now() + minutes * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
