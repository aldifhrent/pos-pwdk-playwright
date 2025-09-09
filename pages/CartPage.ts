import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private getCartRow(productName: string): Locator {
    return this.page.locator("div.p-4.border-b").filter({ hasText: productName });
  }

  async getQuantity(productName: string): Promise<number> {
    const row = this.getCartRow(productName);
    const qtyText = await row.locator("span.w-8.text-center").innerText();
    return parseInt(qtyText, 10);
  }

  async decreaseQuantity(productName: string) {
    const row = this.getCartRow(productName);
    await row.locator("button").first().click(); 
  }

  // Klik tombol plus
  async increaseQuantity(productName: string) {
    const row = this.getCartRow(productName);
    await row.locator("button").nth(1).click(); 
  }

  // Klik tombol trash (remove)
  async removeProduct(productName: string) {
    const row = this.getCartRow(productName);
    await row.locator("button").last().click();
  }
}
