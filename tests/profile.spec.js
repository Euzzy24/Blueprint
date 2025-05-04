import { expect, test } from "@playwright/test";

test.use({
  storageState: "storageState.json",
  baseURL: "https://react-blueprint.mugna.tech/settings",
});

// test("Change Profile", async ({ page }) => {
//   await page.goto("/");

//   await page.getByRole("img", { name: "User Avatar" }).click();
//   await page.getByRole("button", { name: "Settings" }).click();
//   await page.waitForTimeout(1000);

//   // await page.getByRole("button").filter({ hasText: /^$/ }).nth(2).click();
//   await page.setInputFiles(
//     'input[type="file"]',
//     "C:/Users/63905/Pictures/illustrator/withKM.png"
//   );

//   page.once("dialog", (dialog) => {
//     console.log(dialog.message());
//     dialog.accept();
//   });

//   await page.getByRole("button", { name: "Save" }).click();
// });

// import { test, expect } from "@playwright/test";
// import path from "path";

test("Change Profile Picture via Upload Button", async ({ page }) => {
  // await page.goto("/");

  // await page.getByRole("img", { name: "User Avatar" }).click();
  // await page.getByRole("button", { name: "Settings" }).click();
  await page.waitForTimeout(1000);

  // Waiting for file chooser and trigger it by clicking the Upload button
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Upload" }).click();
  const fileChooser = await fileChooserPromise;

  // Setting the file
  await fileChooser.setFiles("C:/Users/63905/Pictures/illustrator/withKM.png");
  // Step 4: Save changes
  await page.getByRole("button", { name: "Save" }).click();

  try {
    await expect(page.getByText("Image Uploaded Successfully")).toBeVisible({
      timeout: 5000,
    });
    console.log("✅ Toast appeared: Image uploaded successfully.");
  } catch (error) {
    console.log("❌ Toast did not appear.");
  }
});

test("Change Profile Picture via Upload Icon", async ({ page }) => {
  // await page.goto("/settings");
  // await page.waitForTimeout(1000);

  // Waiting for file chooser and trigger it by clicking the Upload button
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button").filter({ hasText: /^$/ }).nth(3).click();
  const fileChooser = await fileChooserPromise;

  // Setting the file
  await fileChooser.setFiles(
    "C:/Users/63905/Pictures/illustrator/penny_black.png"
  );

  await page.waitForTimeout(1000);
  const blobImage = page.locator(
    'img[alt="placeholder avatar image"][src^="blob:"]'
  );
  const uploadedImage = page.locator(
    'img[alt="placeholder avatar image"][src^="https://django-blueprint.mugna.tech/media/profile_pictures/"]'
  );

  await expect(blobImage).toBeVisible();
  const removeButton = page.getByRole("button", { name: "Remove" });
  await expect(removeButton).not.toBeDisabled();
  await removeButton.click();
  await expect(blobImage).not.toBeVisible();
  await page.waitForTimeout(1000);
  await expect(uploadedImage).toBeVisible();

  const fileChooserPromiseAgain = page.waitForEvent("filechooser");
  await page.getByRole("button").filter({ hasText: /^$/ }).nth(3).click();
  const chosenFile = await fileChooserPromiseAgain;

  // Setting the file
  await chosenFile.setFiles(
    "C:/Users/63905/Pictures/illustrator/penny_black.png"
  );
  await expect(removeButton).not.toBeDisabled();
  // Step 4: Save changes
  await page.getByRole("button", { name: "Save" }).click();
  try {
    await expect(page.getByText("Image Uploaded Successfully")).toBeVisible({
      timeout: 5000,
    });
    console.log("✅ Toast appeared: Image uploaded successfully.");
  } catch (error) {
    console.log("❌ Toast did not appear.");
  }
});
// test("Verify that country button changes the country code of the phone number", async({page}) => {
//   const countryCode = page.getByTestId("country-code");
// })

test("Country selector updates phone input country code", async ({ page }) => {
  await page.goto("/settings");
  await page.waitForTimeout(1000);
  // Wait for the 'Details' section button to be visible and click it
  const detailsButton = page
    .locator("section")
    .filter({ hasText: "DetailsEditFirst NameLast" })
    .locator("button");

  await detailsButton.waitFor({ state: "visible" });
  await detailsButton.click();

  // Wait for phone country select to be attached and interactable
  const countrySelect = page.getByLabel("Phone number country");
  await countrySelect.waitFor({ state: "attached" });

  // Wait for the input field to be ready
  const phoneInput = page.locator(".PhoneInputInput");
  await phoneInput.waitFor({ state: "visible" });
  await page.waitForTimeout(1000);
  // Change the country to Japan
  await countrySelect.selectOption("JP");
  // await countrySelect.selectOption("PH");

  // Assert phone input value changes to the Japan country code
  const existing = await phoneInput.inputValue();
  expect(existing).toBe("+81");
  // const existing = await phoneInput.inputValue();
  // expect(existing).toBe("+63");

  // Fill the input with full number
  await phoneInput.fill(`${existing} 612345678`);
  // await phoneInput.fill(`${existing} 9051614283`);

  // Confirm the full phone number
  const rawValue = await phoneInput.inputValue();
  const plainNumber = rawValue.replace(/\D/g, ""); // keep only digits

  expect(plainNumber).toBe("81612345678");
  // expect(plainNumber).toBe("639051614283");
});

test("Update all", async ({ page }) => {
  await page.goto("/settings");
  await page.waitForTimeout(1000);
  const detailsButton = page
    .locator("section")
    .filter({ hasText: "DetailsEditFirst NameLast" })
    .locator("button");
  const firstName = page.getByRole("textbox", { name: "First Name" });
  const lastName = page.getByRole("textbox", { name: "Last Name" });
  const email = page.getByRole("textbox", { name: "Email" });
  const birthdayInput = page.locator('input[name="birthday"]');
  const birthdayInputOpen = page.locator(
    'input[name="birthday"][data-state="open"]'
  );
  const birthdayInputClosed = page.locator(
    'input[name="birthday"][data-state="closed"]'
  );

  await detailsButton.waitFor({ state: "visible" });
  await detailsButton.click();
  await page.waitForTimeout(1000);

  await firstName.click();
  await firstName.fill("Meoww");
  expect(await firstName.inputValue()).toBe("Meoww");

  await lastName.click();
  await lastName.fill("Reall");
  expect(await lastName.inputValue()).toBe("Reall");

  await email.click();
  await email.fill("meowreal@gmail.com");
  expect(await email.inputValue()).toBe("meowreal@gmail.com");

  const countrySelect = page.getByLabel("Phone number country");
  await countrySelect.waitFor({ state: "attached" });

  // Wait for the input field to be ready
  const phoneInput = page.locator(".PhoneInputInput");
  await phoneInput.waitFor({ state: "visible" });
  await page.waitForTimeout(1000);
  // Change the country to Japan
  await countrySelect.selectOption("JP");
  // await countrySelect.selectOption("PH");

  // Assert phone input value changes to the Japan country code
  const existing = await phoneInput.inputValue();
  expect(existing).toBe("+81");
  // const existing = await phoneInput.inputValue();
  // expect(existing).toBe("+63");

  // Fill the input with full number
  await phoneInput.fill(`${existing} 612345678`);
  // await phoneInput.fill(`${existing} 9051614283`);

  // Confirm the full phone number
  const rawValue = await phoneInput.inputValue();
  const plainNumber = rawValue.replace(/\D/g, ""); // keep only digits

  expect(plainNumber).toBe("81612345678");
  // expect(plainNumber).toBe("639051614283");

  await birthdayInput.click();
  await expect(birthdayInputOpen).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(birthdayInputOpen).not.toBeVisible();
  await birthdayInput.click();
  await page
    .getByRole("button", { name: "calendar view is open, switch" })
    .click();
  await page.getByRole("radio", { name: "February" }).click();
  await page.getByRole("gridcell", { name: "23" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^2003$/ })
    .click();
  await page.getByRole("button", { name: "OK" }).click();
  await expect(birthdayInputClosed).toBeVisible();
  await expect(birthdayInputClosed).toHaveValue("2003-02-23");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByText("Profile update is successful!")).toBeVisible({
    timeout: 5000,
  });
});
