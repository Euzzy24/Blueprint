import { chromium } from "@playwright/test";

const USER_EMAIL = "meretest@gmail.com";
const USER_PASSWORD = "Mugna2025!";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to the page with credentials in the URL (basic auth)
  await page.goto("https://blueprint:Mugna2024!@react-blueprint.mugna.tech");
  await page.goto("https://react-blueprint.mugna.tech");

  // Fill in the login form
  const email_input = page.getByPlaceholder("Email");
  const password_input = page.getByPlaceholder("Password");
  await email_input.fill(USER_EMAIL);
  await password_input.fill(USER_PASSWORD);
  await page.locator("button", { hasText: "Log In" }).click();

  // Wait for the page to navigate after login (adjust the timeout as necessary)
  // await page.waitForNavigation({ waitUntil: "load", timeout: 60000 });

  // Optionally wait for a specific element that indicates successful login
  await page.waitForSelector(
    'h1:has-text("Create with Mugna Tech\'s Blueprint")',
    {
      timeout: 90000, // Increase the timeout if necessary
    }
  );

  // Save the login session to file
  await context.storageState({ path: "storageState.json" });

  // Close the browser
  await browser.close();
})();
