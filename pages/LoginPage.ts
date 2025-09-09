import { BASE_URL } from "./../data/config";
import { Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput;
  readonly passwordInput;
  readonly loginButton;
  readonly errorMessage;
  readonly dashboardTitle;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.getByText("Invalid Credentials");
    this.dashboardTitle = page.locator("h1.text-2xl.font-bold", {
      hasText: "POS System",
    });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email.trim());
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  getDashboardTitle() {
    return this.dashboardTitle;
  }

  async submitBypassValidation() {
    await this.page.$eval("form", (form: HTMLFormElement) => form.submit());
  }

  async getValidationMessage(input: "email" | "password") {
    const field = input === "email" ? this.emailInput : this.passwordInput;
    return field.evaluate((el: HTMLInputElement) => el.validationMessage);
  }
}
