import { BASE_URL } from "./../data/config";
import { Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput;
  readonly passwordInput;
  readonly loginButton;
  readonly errorMessage;

  constructor(page: Page) {
    this.page = page;
    
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.getByText("Invalid Credentials");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  async getValidationMessage(input: "email" | "password") {
    const field = input === "email" ? this.emailInput : this.passwordInput;
    return field.evaluate((el: HTMLInputElement) => el.validationMessage);
  }
}
