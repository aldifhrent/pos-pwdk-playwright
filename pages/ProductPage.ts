import { Page, Locator } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly categoryDropdown: Locator;
  readonly cartSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder("Search products...");
    this.categoryDropdown = page.locator("select");
    this.cartSection = page.locator("h2", { hasText: "Cart" });
  }

  async searchProduct(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press("Enter");
  }

  async filterByCategory(category: string) {
    await this.categoryDropdown.selectOption({ label: category });
  }

  async addToCart(productName: string) {
    const productCard = this.page
      .locator(".bg-white.rounded-lg.shadow-md.border")
      .filter({ hasText: productName });
    await productCard.getByRole("button", { name: "Add to Cart" }).click();
  }

  async getCartItem(productName: string) {
    return this.page.locator("div").filter({ hasText: productName }).first();
  }

  async isCartEmpty() {
    return this.page.getByText("Your cart is empty").isVisible();
  }
}
