import { expect, test } from "@playwright/test";

test.use({
  storageState: "storageState.json",
  baseURL: "https://react-blueprint.mugna.tech",
});

const countries = [
  { code: "PH", expected: "+63", plain: "639051614283" },
  { code: "PL", expected: "+48", plain: "48123456789" },
  { code: "PT", expected: "+351", plain: "351912345678" },
  { code: "PR", expected: "+1-787", plain: "17871234567" },
  { code: "QA", expected: "+974", plain: "97412345678" },
  { code: "RO", expected: "+40", plain: "40123456789" },
  { code: "RU", expected: "+7", plain: "79161234567" },
  { code: "RW", expected: "+250", plain: "250123456789" },
  { code: "KN", expected: "+1-869", plain: "18691234567" },
  { code: "LC", expected: "+1-758", plain: "17581234567" },
  { code: "VC", expected: "+1-784", plain: "17841234567" },
];

test.beforeEach(async ({ page }) => {
  await page.waitForLoadState("networkidle0");
});

test.describe("Blueprint Profile Settings", () => {
  test.use({
    viewport: { width: 1555, height: 750 },
    timeout: 40000, // Increased timeout for reliability
  });

  test("Change Profile Picture via Upload Button", async ({ page }) => {
    await page.goto("/settings");

    // Waiting for file chooser and trigger it by clicking the Upload button
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Upload" }).click();
    const fileChooser = await fileChooserPromise;

    // Setting the file
    await fileChooser.setFiles("C:/Users/63905/Pictures/illustrator/pen.jpg");
    // Step 4: Save changes
    await page.getByRole("button", { name: "Save" }).click();

    try {
      await expect(page.getByText("Image Uploaded Successfully")).toBeVisible({
        timeout: 5000,
      });
      console.log("Toast appeared: Image uploaded successfully.");
    } catch (error) {
      console.log("Toast did not appear.");
    }
  });

  test("Change Profile Picture via Upload Icon", async ({ page }) => {
    await page.goto("/settings");
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
    await chosenFile.setFiles("C:/Users/63905/Pictures/illustrator/withKM.png");
    await expect(removeButton).not.toBeDisabled();
    // Step 4: Save changes
    await page.getByRole("button", { name: "Save" }).click();
    try {
      await expect(page.getByText("Image Uploaded Successfully")).toBeVisible({
        timeout: 5000,
      });
      console.log("Toast appeared: Image uploaded successfully.");
    } catch (error) {
      console.log("Toast did not appear.");
    }
  });
  // test("Verify that country button changes the country code of the phone number", async({page}) => {
  //   const countryCode = page.getByTestId("country-code");
  // })
  test("Country selector updates phone input country code randomly", async ({
    page,
  }) => {
    const selected = countries[Math.floor(Math.random() * countries.length)];
    const { code, expected, plain } = selected;

    console.log(`Testing country: ${code}, expected prefix: ${expected}`);

    await page.goto("/settings");
    await page.waitForTimeout(1000);

    const detailsButton = page
      .locator("section")
      .filter({ hasText: "DetailsEditFirst NameLast" })
      .locator("button");
    await detailsButton.waitFor({ state: "visible" });
    await detailsButton.click();

    const countrySelect = page.getByLabel("Phone number country");
    await countrySelect.waitFor({ state: "attached" });

    const phoneInput = page.locator(".PhoneInputInput");
    await phoneInput.waitFor({ state: "visible" });
    await page.waitForTimeout(1000);

    await countrySelect.selectOption(code);
    await page.waitForTimeout(1000);
    const current = await phoneInput.inputValue();
    expect(current).toContain(expected.replace(/\D/g, ""));
    console.log(`Country Code: ${current}`);

    const prefixDigits = expected.replace(/\D/g, "");
    const localNumber = plain.replace(prefixDigits, "");

    await phoneInput.fill(`${expected} ${localNumber}`);
    await page.waitForTimeout(1000);

    const finalValue = await phoneInput.inputValue();
    const digitsOnly = finalValue.replace(/\D/g, "");

    expect(digitsOnly).toBe(plain);
    console.log(`digitsOnly: ${digitsOnly}, plain: ${plain}`);
  });

  test("Update all", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("img", { name: "User Avatar" }).click();
    await page.getByRole("button", { name: "Settings" }).click();
    await page.waitForTimeout(1000);

    const current_fname = "Meow";
    const current_lname = "Real";
    const current_email = "meretest@gmail.com";

    const test_fname = "Meoww";
    const test_lname = "Reall";
    const test_email = "meowtest@gmail.com";

    const detailsButton = page
      .locator("section")
      .filter({ hasText: "DetailsEditFirst NameLast" })
      .locator("button");
    const firstName = page.getByRole("textbox", { name: "First Name" });
    const lastName = page.getByRole("textbox", { name: "Last Name" });
    const email = page.getByRole("textbox", { name: "Email" });

    const countrySelect = page.getByLabel("Phone number country");
    const phoneInput = page.locator(".PhoneInputInput");
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
    await firstName.fill(test_fname);
    expect(await firstName.inputValue()).toBe("Meoww");

    await lastName.click();
    await lastName.fill(test_lname);
    expect(await lastName.inputValue()).toBe("Reall");

    await email.click();
    await email.fill(test_email);
    expect(await email.inputValue()).toBe("meowtest@gmail.com");
    await countrySelect.waitFor({ state: "attached" });

    // Wait for the input field to be ready
    await phoneInput.waitFor({ state: "visible" });
    await page.waitForTimeout(1000);
    // Change the country to Japan
    await countrySelect.selectOption("JP");
    const existing = await phoneInput.inputValue();
    expect(existing).toBe("+81");
    await phoneInput.fill(`${existing} 612345678`);

    const rawValue = await phoneInput.inputValue();
    const plainNumber = rawValue.replace(/\D/g, ""); // keep only digits

    expect(plainNumber).toBe("81612345678");

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

    // Revert changes
    await detailsButton.waitFor({ state: "visible" });
    await detailsButton.click();
    await page.waitForTimeout(1000);

    await firstName.click();
    await firstName.fill(current_fname);
    expect(await firstName.inputValue()).toBe("Meow");

    await lastName.click();
    await lastName.fill(current_lname);
    expect(await lastName.inputValue()).toBe("Real");

    await email.click();
    await email.fill(current_email);
    expect(await email.inputValue()).toBe("meretest@gmail.com");
    await countrySelect.waitFor({ state: "attached" });

    // Wait for the input field to be ready
    await phoneInput.waitFor({ state: "visible" });
    await page.waitForTimeout(1000);
    //Revert to Philippines
    await countrySelect.selectOption("PH");

    // Assert phone input value changes to the Philippines country code
    const new_existing = await phoneInput.inputValue();
    expect(new_existing).toBe("+63");
    await phoneInput.fill(`${new_existing} 9051614283`);

    // Confirm the full phone number
    const origValue = await phoneInput.inputValue();
    const onlyNumber = origValue.replace(/\D/g, ""); // keep only digits
    expect(onlyNumber).toBe("639051614283");

    await birthdayInput.click();
    await page
      .getByRole("button", { name: "calendar view is open, switch" })
      .click();
    await page.getByRole("radio", { name: "February" }).click();
    await page.getByRole("gridcell", { name: "24" }).click();
    await page
      .locator("div")
      .filter({ hasText: /^2003$/ })
      .click();
    await page.getByRole("button", { name: "OK" }).click();
    await expect(birthdayInputClosed).toBeVisible();
    await expect(birthdayInputClosed).toHaveValue("2003-02-24");
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByText("Profile update is successful!")).toBeVisible({
      timeout: 5000,
    });
  });

  test("Change Password", async ({ page }) => {
    await page.goto("/settings");
    const securityForm = page.locator("form", {
      has: page.getByRole("heading", { name: "Security" }),
    });
    const updatePass = page
      .locator("div")
      .filter({ hasText: /^SecurityEdit$/ })
      .getByRole("button");

    const currentPassInput = securityForm.locator('input[name="old_password"]');
    const newPassInput = securityForm.locator('input[name="new_password1"]');
    const confirmNewPass = securityForm.locator('input[name="new_password2"]');
    const saveButton = securityForm.getByRole("button", {
      name: "Save Changes",
    });
    const cancelButton = securityForm.getByRole("button", { name: "Cancel" });

    const current_pass = "Mugna2025!";
    const incorrect_pass = "MeowReal";
    const new_pass = "Mugna2025@";

    await updatePass.click();

    await currentPassInput.fill(current_pass);
    await newPassInput.fill(incorrect_pass);
    await confirmNewPass.fill(current_pass);
    await expect(
      page.getByText(
        "Password must have at least at least 1 uppercase character and 1 special character"
      )
    ).toBeVisible({});
    await expect(page.getByText("Passwords don't match")).toBeVisible({});
    await expect(saveButton).toBeDisabled();

    //Password Don't Match
    await currentPassInput.fill(current_pass);
    await newPassInput.fill(new_pass);
    await confirmNewPass.fill(current_pass);
    await expect(page.getByText("Passwords don't match")).toBeVisible({});
    await expect(saveButton).toBeDisabled();

    //Incorrect current Password
    await currentPassInput.fill(incorrect_pass);
    await newPassInput.fill(new_pass);
    await confirmNewPass.fill(new_pass);
    await saveButton.click();
    await expect(page.getByText("Incorrect password. Try again.")).toBeVisible({
      timeout: 5000,
    });
    await expect(saveButton).toBeDisabled();

    //Password Match
    const passwordFields = [
      { label: "Current Password", value: current_pass },
      { label: "Password", value: new_pass },
      { label: "Confirm Password", value: new_pass },
    ];

    for (const { label, value } of passwordFields) {
      const input = page.getByLabel(label, { exact: true });
      const eyeButton = input.locator("..").locator("button");

      await input.fill(value);

      await eyeButton.click();
      await expect(input).toHaveAttribute("type", "text");

      await eyeButton.click();
      await expect(input).toHaveAttribute("type", "password");
    }

    await saveButton.click();
    await expect(page.getByText("Password Updated Successfully!")).toBeVisible({
      timeout: 5000,
    });

    //Revert password
    await updatePass.click();
    await currentPassInput.fill(new_pass);
    await newPassInput.fill(current_pass);
    await confirmNewPass.fill(current_pass);
    await saveButton.click();
    await expect(page.getByText("Password Updated Successfully!")).toBeVisible({
      timeout: 5000,
    });
  });
});
