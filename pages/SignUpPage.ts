import { Locator, Page } from "@playwright/test";

export class SignUpPage {
  readonly page;
  readonly fullname;
  readonly email;
  readonly password;
  readonly signupUrl;
  readonly loginButton;
  readonly errorMessage;

  constructor(page: Page) {
    this.signupUrl = page.getByRole("button", {
      name: "Don't have an account? Sign up",
    });
    this.fullname = page.getByPlaceholder("Enter your full name");
    this.email = page.locator('input[type="email"]');
    this.password = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.getByText("Invalid Credentials");
  }

  async register(fullname: string, email: string, password: string) {
    await this.fullname.fill(fullname);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async getValidationMessage(input: "email" | "password" | "fullname") {
    let field: Locator;

    switch (input) {
      case "email":
        field = this.email;
        break;
      case "password":
        field = this.password;
        break;
      case "fullname":
        field = this.fullname;
        break;
      default:
        throw new Error(`Unknown input: ${input}`);
    }

    return field.evaluate((el: HTMLInputElement) => el.validationMessage);
  }
}
