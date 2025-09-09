import { test, expect } from "@playwright/test";
import { gotoApp } from "../util/util";
import { ProductPage } from "../pages/ProductPage";
import { LoginPage } from "../pages/LoginPage";
import { CREDENTIALS } from "../data/config";

test.describe("Product Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });

    const loginPage = new LoginPage(page);
    await loginPage.login(CREDENTIALS.email, CREDENTIALS.password);
  });

  test("Search produk berhasil", async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.searchProduct("Wireless Headphones");

    const product = page.locator("h3", { hasText: "Wireless Headphones" });
    await expect(product).toBeVisible();
  });

  test("Filter produk berdasarkan kategori", async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.filterByCategory("Electronics");

    const product = page.locator("h3", { hasText: "Wireless Headphones" });
    await expect(product).toBeVisible();
  });

  test("Tambah produk ke cart", async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.addToCart("Cotton T-Shirt");

    await expect(await productPage.getCartItem("Cotton T-Shirt")).toBeVisible();
  });

  test("Tambah lebih dari 1 produk ke cart", async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.addToCart("Smartphone Case");
    await productPage.addToCart("Coffee Beans");

    await expect(await productPage.getCartItem("Smartphone Case")).toBeVisible();
    await expect(await productPage.getCartItem("Coffee Beans")).toBeVisible();
  });

  test("Cart kosong menampilkan pesan", async ({ page }) => {
    const productPage = new ProductPage(page);

    const isEmpty = await productPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });
});
