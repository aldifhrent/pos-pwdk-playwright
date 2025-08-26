import { test, expect } from "@playwright/test";
import { gotoApp } from "../../util/util";
import { BASE_URL, CREDENTIALS } from "../../data/config";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });
  });

  test("Login with only email (password required)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(CREDENTIALS.email, "");

    const validationMsg = await loginPage.getValidationMessage("password");
    expect(validationMsg).toBe("Please fill out this field.");
  });

  test("Login with only password (email required)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("", CREDENTIALS.password);

    const validationMsg = await loginPage.getValidationMessage("email");
    expect(validationMsg).toBe("Please fill out this field.");
  });

  test("Login with no email and password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("", "");

    const validationEmail = await loginPage.getValidationMessage("email");
    const validationPassword = await loginPage.getValidationMessage("password");

    expect(validationEmail).toBe("Please fill out this field.");
    expect(validationPassword).toBe("Please fill out this field.");
  });

  test("Login with email without @", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login("admin", CREDENTIALS.password);

    const validationMsg = await loginPage.getValidationMessage("email");

    expect(validationMsg).toBe(
      "Please include an '@' in the email address. 'admin' is missing an '@'."
    );
  });

  test("Login dengan email ada spasi depan & belakang", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("   admin@pos.com   ", "admin");
    await expect(page.locator("h1.text-2xl.font-bold")).toHaveText(
      "POS System"
    );
  });

  test("Login gagal dengan SQL Injection attempt", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("' OR '1'='1", "' OR '1'='1");
    await expect(page.locator("h1.text-2xl.font-bold")).not.toBeVisible();
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("Login gagal dengan email uppercase tanpa domain valid", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("ADMINPOS", "admin");
    const msg = await loginPage.getValidationMessage("email");
    console.log(msg);
    expect(msg).toContain("@");
  });

  test("Input email with long character", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const longEmail = "a".repeat(250) + "@pos.com";
    await loginPage.login(longEmail, "admin");

    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

  test("User bisa login valid with email UPPERCASE", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("ADMIN@POS.COM", CREDENTIALS.password);

    await expect(page.locator("h1.text-2xl.font-bold")).toHaveText(
      "POS System"
    );
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test("User bisa login valid with password UPPERCASE", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(CREDENTIALS.email, "ADMIN");

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });
});
