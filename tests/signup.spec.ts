import { test, expect } from "@playwright/test";
import { gotoApp } from "../util/util";
import { SignUpPage } from "../pages/SignUpPage";
import { SignUpDummy } from "../data/config";

// ======================
// Validation Tests
// ======================
test.describe("Sign Up Page - Validation Test", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });
    const signUpPage = new SignUpPage(page);
    await signUpPage.signupUrl.click();
  });

  test("Email Required", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.register(SignUpDummy.fullname, "", SignUpDummy.password);

    const msg = await signUpPage.getValidationMessage("email");
    expect(msg).toMatch(/fill out/i);
  });

  test("Full Name Required", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.register("", SignUpDummy.email, SignUpDummy.password);

    const msg = await signUpPage.getValidationMessage("fullname");
    expect(msg).toMatch(/fill out/i);
  });

  test("Password Required", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.register(SignUpDummy.fullname, SignUpDummy.email, "");

    const msg = await signUpPage.getValidationMessage("password");
    expect(msg).toMatch(/fill out/i);
  });

  test("Email '@' is Required", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.register(
      SignUpDummy.fullname,
      "michaeljex",
      SignUpDummy.password
    );

    const msg = await signUpPage.getValidationMessage("email");
    expect(msg).toMatch(/(include|enter).*email address/i);
  });
});

// ======================
// Positive Tests
// ======================
test.describe("Sign Up Page - Positive", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });
    const signUpPage = new SignUpPage(page);
    await signUpPage.signupUrl.click();
  });

  test("Valid signup dengan email lowercase", async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await signUpPage.register(
      SignUpDummy.fullname,
      SignUpDummy.email,
      SignUpDummy.password
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });

  test("Valid signup dengan email UPPERCASE", async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await signUpPage.register(
      SignUpDummy.fullname,
      SignUpDummy.email.toUpperCase(),
      SignUpDummy.password
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });

  test("Valid signup dengan email MiXeDCaSe", async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await signUpPage.register(
      SignUpDummy.fullname,
      "MiXeDCaSe" + SignUpDummy.email.slice(8),
      SignUpDummy.password
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });

  test("Valid signup dengan spasi di depan dan belakang email", async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await signUpPage.register(
      SignUpDummy.fullname,
      "   " + SignUpDummy.email + "   ",
      SignUpDummy.password
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });

  test("Valid signup dengan spasi di depan dan belakang fullname", async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await signUpPage.register(
      "   " + SignUpDummy.fullname + "   ",
      SignUpDummy.email,
      SignUpDummy.password
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });

  test("Valid signup dengan spasi di depan dan belakang password", async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await signUpPage.register(
      SignUpDummy.fullname,
      SignUpDummy.email,
      "   " + SignUpDummy.password + "   "
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });

  test("Valid signup dengan fullname lebih dari 30 karakter", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    const longFullname = "A".repeat(31);

    await signUpPage.register(
      longFullname,
      SignUpDummy.email,
      SignUpDummy.password
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });

  test("Valid signup dengan fullname 1 karakter", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    const shortFullname = "A";

    await signUpPage.register(
      shortFullname,
      SignUpDummy.email,
      SignUpDummy.password
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });

  test("Valid signup dengan password lebih dari 8 karakter", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    const longPassword = "A".repeat(9);

    await signUpPage.register(
      SignUpDummy.fullname,
      SignUpDummy.email,
      longPassword
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });

  test("Valid signup dengan password 8 karakter", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    const exactPassword = "A".repeat(8);

    await signUpPage.register(
      SignUpDummy.fullname,
      SignUpDummy.email,
      exactPassword
    );

    await expect(page.locator("h1", { hasText: "POS System" })).toBeVisible();
  });
});
