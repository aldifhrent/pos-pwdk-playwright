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

    const msg = await loginPage.getValidationMessage("password");
    expect(msg).toMatch(/fill out/i);
  });

  test("Email required", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("", CREDENTIALS.password);

    const msg = await loginPage.getValidationMessage("email");
    expect(msg).toMatch(/fill out/i);
  });

  test("Email & Password required", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("", "");

    expect(await loginPage.getValidationMessage("email")).toMatch(/fill out/i);
    expect(await loginPage.getValidationMessage("password")).toMatch(/fill out/i);
  });

  test("Invalid email format (missing @)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("admin", CREDENTIALS.password);

    const msg = await loginPage.getValidationMessage("email");
    expect(msg).toMatch(/(include|enter).*email address/i);
  });

  test("Invalid email uppercase tanpa domain valid", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("ADMINPOS", "admin");

    const msg = await loginPage.getValidationMessage("email");
    expect(msg).toMatch(/(include|enter).*email address/i);
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
    await loginPage.login(CREDENTIALS.email.toUpperCase(), CREDENTIALS.password);

    await expect(loginPage.getDashboardTitle()).toBeVisible();
  });

  test("Valid login dengan email ada spasi depan & belakang", async ({ page, browserName }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("   " + CREDENTIALS.email + "   ", CREDENTIALS.password);

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

  test("Login gagal dengan SQL Injection", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("' OR '1'='1", "' OR '1'='1");

    // bypass HTML5 validation jika ada
    if (loginPage.submitBypassValidation) {
      await loginPage.submitBypassValidation();
    }

    await expect(loginPage.getErrorMessage()).toBeVisible();
    await expect(loginPage.getDashboardTitle()).not.toBeVisible();
  });

  test("Login gagal dengan email terlalu panjang", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const longEmail = "a".repeat(250) + "@pos.com";
    await loginPage.login(longEmail, CREDENTIALS.password);

    await expect(loginPage.getErrorMessage()).toBeVisible();
  });

  test("Login gagal jika password berbeda case", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(CREDENTIALS.email, CREDENTIALS.password.toUpperCase());

    await expect(loginPage.getErrorMessage()).toBeVisible();
  });
});
