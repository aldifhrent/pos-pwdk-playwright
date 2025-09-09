import { test, expect } from "@playwright/test";
import { gotoApp } from "../util/util";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { LoginPage } from "../pages/LoginPage";
import { CREDENTIALS } from "../data/config";

test.describe("Cart Quantity & Remove", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });

    const loginPage = new  LoginPage(page);
    await loginPage.login(CREDENTIALS.email, CREDENTIALS.password)
  });

  test("User bisa tambah & kurang quantity produk @cart", async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.addToCart("Wireless Headphones");

    // Default qty = 1
    let qty = await cartPage.getQuantity("Wireless Headphones");
    expect(qty).toBe(1);

    // Tambah jadi 2
    await cartPage.increaseQuantity("Wireless Headphones");
    qty = await cartPage.getQuantity("Wireless Headphones");
    expect(qty).toBe(2);

    // Kurangi jadi 1 lagi
    await cartPage.decreaseQuantity("Wireless Headphones");
    qty = await cartPage.getQuantity("Wireless Headphones");
    expect(qty).toBe(1);
  });

  test("User bisa menghapus produk dari cart @cart", async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await productPage.addToCart("Smartphone Case");
    await cartPage.removeProduct("Smartphone Case");

    // Cart kosong lagi
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });
});
