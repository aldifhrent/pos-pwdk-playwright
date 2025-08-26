import { SignUpPage } from './../pages/SignUpPage';
import { test, expect } from "@playwright/test";
import { gotoApp } from "../util/util";
import { CREDENTIALS } from "../data/config";
import { LoginPage } from "../pages/LoginPage";

//
// ========== Validation Tests ==========
//
test.describe("Login Page - Validation Tests", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });
  });

  test("Password required", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(CREDENTIALS.email, "");

    const validationMsg = await loginPage.getValidationMessage("password");
    expect(validationMsg).toMatch(/fill out/i);
  });

  test("Email required", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("", CREDENTIALS.password);

    const validationMsg = await loginPage.getValidationMessage("email");
    expect(validationMsg).toMatch(/fill out/i);
  });

  test("Email & Password required", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("", "");

    const validationEmail = await loginPage.getValidationMessage("email");
    const validationPassword = await loginPage.getValidationMessage("password");

    expect(validationEmail).toMatch(/fill out/i);
    expect(validationPassword).toMatch(/fill out/i);
  });

  test("Invalid email format (missing @)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("admin", CREDENTIALS.password);

    const validationMsg = await loginPage.getValidationMessage("email");
    expect(validationMsg).toMatch(/(include|enter).*email address/i);
  });

  test("Invalid email uppercase tanpa domain valid", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("ADMINPOS", "admin");

    const msg = await loginPage.getValidationMessage("email");
    expect(msg).toMatch(/(include|enter).*email address/i)
  });
});

//
// ========== Positive Tests ==========
//
test.describe("Login Page - Positive Tests", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });
  });

  test("Valid login dengan email lowercase", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(CREDENTIALS.email, CREDENTIALS.password);

    await expect(loginPage.getDashboardTitle()).toBeVisible();
  });

  test("Valid login dengan email UPPERCASE", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("ADMIN@POS.COM", CREDENTIALS.password);

    await expect(loginPage.getDashboardTitle()).toBeVisible();
  });

  test("Valid login dengan email ada spasi depan & belakang", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("   admin@pos.com   ", CREDENTIALS.password);

    await expect(loginPage.getDashboardTitle()).toBeVisible();
  });
});

//
// ========== Negative Tests ==========
//
test.describe("Login Page - Negative Tests", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });
  });

  test("Login gagal dengan SQL Injection (bypass HTML5 validation)", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login("' OR '1'='1", "' OR '1'='1")

    await loginPage.submitBypassValidation()

    await expect(loginPage.getErrorMessage()).toBeVisible()
    await expect(loginPage.dashboardTitle()).not.toBeVisible()
  });

  test("Login gagal dengan email terlalu panjang", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const longEmail = "a".repeat(250) + "@pos.com";
    await loginPage.login(longEmail, CREDENTIALS.password);

    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

  test("Login gagal jika password berbeda case (case-sensitive)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(CREDENTIALS.email, "ADMIN");

    await expect(loginPage.getErrorMessage()).toBeVisible();
  });
});
