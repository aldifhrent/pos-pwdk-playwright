import { test, expect } from "@playwright/test";
import { gotoApp } from "../util/util";
import { SignUpPage } from "../pages/SignUpPage";
import { SignUpDummy } from "../data/config";

// Validation Test
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
    console.log(msg);

    expect(msg).toMatch(/fill out/i)
  });

  test("Full Name Required", async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await signUpPage.register("", SignUpDummy.email, SignUpDummy.password);

    const msg = await signUpPage.getValidationMessage("fullname");
    console.log(msg);

    expect(msg).toMatch(/fill out/i)
  });

  test("Password Required", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.register(SignUpDummy.fullname, SignUpDummy.email, "");

    const msg = await signUpPage.getValidationMessage("password");
    console.log(msg);

    expect(msg).toMatch(/fill out/i)
  });

  test("Email '@' is Required", async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.register(
      SignUpDummy.fullname,
      "michaeljex",
      SignUpDummy.password
    );

    const msg = await signUpPage.getValidationMessage("email");
    console.log(msg);

    expect(msg).toMatch(/(include|enter).*email address/i);
  });
});

// Positive Test

test.describe("Sign Up Page - Positive", () => {
  test.beforeEach("Valid signup dengan email lowercase", async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await signUpPage.register(
      SignUpDummy.fullname,
      SignUpDummy.email,
      SignUpDummy.password
    );

    await expect(page.locator("h1", { hasText: "POS System" }));
  });
});
