import { Page } from "@playwright/test";

export class SidebarPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickMenu(menuName: string) {
    await this.page.getByRole("button", { name: menuName }).click();
  }

  // Menu spesifik biar gampang dipanggil
  async goToPointOfSale() {
    await this.clickMenu("Point of Sale");
  }

  async goToProducts() {
    await this.clickMenu("Products");
  }

  async goToTransactions() {
    await this.clickMenu("Transactions");
  }

  async goToReports() {
    await this.clickMenu("Reports");
  }

  // Logout
  async signOut() {
    await this.page.getByRole("button", { name: "Sign Out" }).click();
  }
}
