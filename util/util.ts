import { Page } from "@playwright/test";
import { BASE_URL } from "../data/config";

interface GotoAppOptions {
  page: Page;
  path?: string; // opsional
}

export async function gotoApp({ page, path = "/" }: GotoAppOptions) {
  await page.goto(`${BASE_URL}${path}`);
}
