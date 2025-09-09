import { Locator, Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly name: Locator;
  readonly email: Locator;
  readonly paymentMethod: Locator;
  readonly notes: Locator;
  readonly cancelButton: Locator;
  readonly paymentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('input[placeholder="Enter customer name"]');
    this.email = page.locator('input[placeholder="Enter customer email"]');
    this.paymentMethod = page.locator(".grid.grid-cols-3 button");
    this.notes = page.locator(
      'textarea[placeholder="Add any notes for this transaction..."]'
    );
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.paymentButton = page.locator('button', { hasText: "Complete Transaction"})
  }

  async fillName(value: string) {
    await this.name.fill(value);
  }

  async fillEmail(value: string) {
    await this.email.fill(value);
  }

  async fillNotes(value: string) {
    await this.notes.fill(value);
  }

  async selectPayment(method: "Cash" | "Card" | "Digital") {
    await this.page
      .locator(`.grid.grid-cols-3 button:has-text("${method}")`)
      .click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async submitPayment() {
    await this.paymentButton.click();
  }

  async checkoutFlow({
    name,
    email,
    payment,
    notes,
  }: {
    name: string;
    email: string;
    payment: "Cash" | "Card" | "Digital";
    notes?: string;
  }) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.selectPayment(payment);
    if (notes) {
      await this.fillNotes(notes);
    }
    await this.submitPayment();
  }
}
