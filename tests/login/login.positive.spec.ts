import { test, expect } from "@playwright/test";
import { gotoApp } from "../../util/util";
import { BASE_URL, CREDENTIALS } from "../../data/config";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });
  });

  test("User bisa login valid", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(CREDENTIALS.email, CREDENTIALS.password);

    await expect(page.locator("h1.text-2xl.font-bold")).toHaveText(
      "POS System"
    );
    await expect(
      page
        .locator("p.text-gray-400.text-sm.mt-1")
        .filter({ hasText: "Point of Sale" })
    ).toBeVisible();

    await expect(page).toHaveURL(BASE_URL);
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
  });

  
});
