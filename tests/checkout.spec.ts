import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { gotoApp } from "../util/util";
import { ProductPage } from "../pages/ProductPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { CREDENTIALS } from "../data/config";

const paymentMethods: ("Cash" | "Card" | "Digital")[] = ["Cash", "Card", "Digital"];

test.describe("Checkout Products", () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp({ page });
    const loginPage = new LoginPage(page);
    await loginPage.login(CREDENTIALS.email, CREDENTIALS.password);

    const productPage = new ProductPage(page);
    await productPage.addToCart("Wireless Headphones");

    await page.getByRole("button", { name: "Checkout" }).click();
  });

  for (const payment of paymentMethods) {
    test(`User bisa lanjut checkout dengan ${payment}`, async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);

      // listen popup sebelum trigger
      const dialogPromise = page.waitForEvent("dialog");

      await checkoutPage.checkoutFlow({
        name: "Aldi",
        email: "aldi@example.com",
        payment,
        notes: "Tolong kirim struk via email 🙏",
      });

      // handle popup
      const dialog = await dialogPromise;
      console.log(`[${payment}] Popup:`, dialog.message());
      await dialog.accept();
    });
  }
});
