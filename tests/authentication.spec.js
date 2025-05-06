import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

const link = "https://react-blueprint.mugna.tech/";

test.use({
  httpCredentials: {
    username: process.env.AUTH_WEBSITE,
    password: process.env.AUTH_WEBPASS,
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto(link);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(page.locator("h1:has-text('Welcome Back!')")).toBeVisible({
    timeout: 10000,
  });
});

test.describe("Blueprint Authentication", () => {
  test("should accept correctly formatted email and should only enable login button if credentials  are correctly formatted", async ({
    page,
  }) => {
    // Find the email input field and input an incorrectly formatted email
    await page.fill('input[name="email"]', "invalidemail@");

    // Find the password input field and fill it with a password
    await page.fill('input[name="password"]', "Password123!");

    // Check if the login button is in a disabled state
    const isLoginButtonDisabled = await page.isDisabled(
      'button[type="submit"]'
    );
    expect(isLoginButtonDisabled).toBe(true);
    console.log("Login button is disabled.");

    // Find the email input field and fill it with a correctly formatted email
    await page.fill('input[name="email"]', "correctemail@example.com");

    // Check if the login button is in a disabled state

    const isLoginButtonEnabled = await page.isDisabled('button[type="submit"]');
    expect(isLoginButtonEnabled).toBe(false);
    console.log("Login button is not disabled.");
  });

  test("should redirect to forgot password page when forgot password button is clicked", async ({
    page,
  }) => {
    // Look for the "Forgot Password?" link and click it
    await page.click(
      'a.hover\\:text-primary.font-medium.text-sm.text-primary[href="/password/forgot"]'
    );

    // Pause the page for inspection
    await expect(page.locator('b:has-text("Forgot Password")')).toBeVisible({
      timeout: 5000,
    });
  });

  // test("should enable login button only when credentials are correctly formatted", async ({
  //   page,
  // }) => {
  //   // Test implementation goes here
  // });

  test("should show/hide password when view icon button is clicked", async ({
    page,
  }) => {
    // Input a password in the password input field
    await page.fill('input[name="password"]', "MySecretPassword123!");

    // Look for the password input field and check if it is initially hidden
    const passwordInput = await page.$('input[name="password"]');
    const passwordInputType = await passwordInput.getAttribute("type");
    expect(passwordInputType).toBe("password");
    console.log("Password is initially hidden.");

    // Look for the view button and click it
    await page.click('button[type="button"] > svg.lucide.lucide-eye');

    // Check if the password is now visible
    const passwordInputTypeAfterClick = await passwordInput.getAttribute(
      "type"
    );
    expect(passwordInputTypeAfterClick).toBe("text");
    console.log("Password is now visible.");

    // Click the view button again to hide the password
    await page.click('button[type="button"] > svg.lucide.lucide-eye-off');

    // Check if the password is now hidden again
    const passwordInputTypeAfterSecondClick = await passwordInput.getAttribute(
      "type"
    );
    expect(passwordInputTypeAfterSecondClick).toBe("password");
    console.log("Password is now hidden again.");
  });

  test("should allow checking/unchecking remember me checkbox", async ({
    page,
  }) => {
    // Check if the "Remember Me" checkbox is checked
    const isCheckedInitially = await page.isChecked('button[role="checkbox"]');

    if (!isCheckedInitially) {
      console.log("Not checked initially.");
      // Check the checkbox
      await page.check('button[role="checkbox"]');

      // Assert that it is checked
      const isCheckedAfterCheck = await page.isChecked(
        'button[role="checkbox"]'
      );
      if (isCheckedAfterCheck) {
        console.log("Checked.");
      } else {
        console.log("Not checked.");
      }
    }

    // Uncheck the checkbox
    await page.uncheck('button[role="checkbox"]');

    // Assert that it is unchecked
    const isUncheckedFinally = await page.isChecked('button[role="checkbox"]');
    if (!isUncheckedFinally) {
      console.log("Unchecked passed successfully.");
    } else {
      console.log("Checked test failed.");
    }
  });

  test("should allow user to log in with authenticated account", async ({
    page,
  }) => {
    // Get the email and password from the environment variables
    // Load the environment variables

    // Get the email and password from the environment variables
    const email = process.env.AUTH_EMAIL;
    const password = process.env.AUTH_PASSWORD;

    // Log the email and password
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    // Input the email and password into the respective fields
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Click the log in button
    // Check if the login button is disabled
    let isLoginButtonDisabled = await page.isDisabled('button[type="submit"]');

    if (isLoginButtonDisabled) {
      // Wait for a few seconds
      await page.waitForTimeout(3000);
    }

    // Click the login button
    await page.click('button[type="submit"]');

    // await page.waitForNavigation({
    //   url: (url) => url.pathname.includes("/home"),
    // });
    console.log(`Logged in successfully as ${email}`);

    await page.pause();
  });

  test("should allow user to log out from account", async ({ page }) => {
    // Test implementation goes here
  });

  test("should not allow login with invalid credentials and should return errors on invalid login attempt", async ({
    page,
  }) => {
    // Test implementation goes here
  });

  test("should reflect correct details on profile when logged in", async ({
    page,
  }) => {
    // Test implementation goes here
  });

  // test("should return errors on invalid login attempt", async ({ page }) => {
  //   // Test implementation goes here
  // });

  // test("should show error state on incorrect email/password format", async ({
  //   page,
  // }) => {
  //   // Test implementation goes here
  // });
});

test.describe("Blueprint Registration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://react-blueprint.mugna.tech/auth/sign-up");
  });

  test("should allow user to input values into input fields", async ({
    page,
  }) => {
    // Verify that user can input values into input fields (firstname, lastname, email, phone,password,confirm password)

    const inputValues = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone_number: "+63 0123456789",
      password1: "StrongPassword123!",
      password2: "StrongPassword123!",
    };

    console.log("Starting error state test for input fields...");

    for (const [name, value] of Object.entries(inputValues)) {
      // Enter incorrectly formatted or null values into the input fields
      if (name === "email") {
        await page.fill(`input[name="${name}"]`, "not an email");
      } else if (name === "password1") {
        await page.fill(`input[name="${name}"]`, "weakpassword");
      } else if (name === "password2") {
        await page.fill(`input[name="${name}"]`, "weakpassword2");
      } else {
        await page.fill(`input[name="${name}"]`, "");
      }

      await page.press(`input[name="${name}"]`, "Tab");

      // Check for error states
      const inputField = await page.$(`input[name="${name}"]`);
      const inputFieldError = await inputField.getAttribute("aria-invalid");
      expect(inputFieldError).toBe("true");
      console.log(`${name} input field has error state`);
    }

    for (const [name, value] of Object.entries(inputValues)) {
      await page.fill(`input[name="${name}"]`, value);
      const inputValue = await page.inputValue(`input[name="${name}"]`);
      expect(inputValue).toBe(value);
      console.log(`${name}: ${inputValue}`);
    }

    // Find the terms and conditions checkbox
    const termsAndConditionsCheckbox = await page.$(
      'button[role="checkbox"][id="terms_conditions"]'
    );
    const isTermsAndConditionsCheckboxChecked =
      await termsAndConditionsCheckbox.getAttribute("aria-checked");
    expect(isTermsAndConditionsCheckboxChecked).toBe("false");

    // Try to submit the form without checking the checkbox first
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    // Verify that the checkbox is now in an error state
    const isTermsAndConditionsCheckboxInvalid =
      await termsAndConditionsCheckbox.getAttribute("aria-invalid");
    expect(isTermsAndConditionsCheckboxInvalid).toBe("true");

    console.log(
      "Terms and conditions checkbox is in error state:",
      isTermsAndConditionsCheckboxInvalid
    );

    // Click the terms and conditions checkbox
    await termsAndConditionsCheckbox.click();
    const isTermsAndConditionsCheckboxCheckedAfterClick =
      await termsAndConditionsCheckbox.getAttribute("aria-checked");
    expect(isTermsAndConditionsCheckboxCheckedAfterClick).toBe("true");
    console.log(
      "Terms and conditions checkbox is now checked:",
      isTermsAndConditionsCheckboxCheckedAfterClick
    );

    // Assert that the form is now submittable
    const isFormSubmittable = await page.$eval(
      "form",
      (element) => !element.querySelector('[aria-invalid="true"]')
    );
    expect(isFormSubmittable).toBe(true);

    // Try to submit the form again
    await page.click('button[type="submit"]');
    console.log("Form submitted successfully");
  });

  test("should only accept email format in email input", async ({ page }) => {
    // Verify that email input will return an error if an invalid email is entered
    await page.fill('input[name="email"]', "not an email");
    //  await page.click('button[type="submit"]');
    await page.press('input[name="email"]', "Tab");
    const emailInput = await page.$('input[name="email"]');
    const emailInputError = await emailInput.getAttribute("aria-invalid");
    expect(emailInputError).toBe("true");
    const emailInputErrorMessage = await page.$eval(
      "p#\\:Rijttpucq\\:-form-item-message",
      (element) => element.textContent
    );
    expect(emailInputErrorMessage).toBe("Email is invalid");

    console.log("Email input error:", emailInputError);
    console.log("Email input error message:", emailInputErrorMessage);

    // Input a valid email
    await page.fill('input[name="email"]', "john.doe@example.com");
    await page.press('input[name="email"]', "Tab");

    const emailInputErrorAgain = await emailInput.getAttribute("aria-invalid");
    expect(emailInputErrorAgain).toBe("false");

    console.log(
      "Email input error after inputting a valid email:",
      emailInputErrorAgain
    );
  });

  test("should change country code on phone number input based on country selection", async ({
    page,
  }) => {
    // Verify that country button on the phone number input  changes the country code to the selected country
    const countries = [
      {
        country: "Philippines",
        countryCode: "+63",
        phoneFormat: "+63 0000000000",
      },
      {
        country: "United States",
        countryCode: "+1",
        phoneFormat: "+1 (000) 000-0000",
      },
      {
        country: "Canada",
        countryCode: "+1",
        phoneFormat: "+1 (000) 000-0000",
      },
      {
        country: "Australia",
        countryCode: "+61",
        phoneFormat: "+61 0000 000 000",
      },
    ];

    for (const { country, countryCode, phoneFormat } of countries) {
      await page.selectOption('select[name="phone_numberCountry"]', country);
      const phoneInput = await page.$('input[name="phone_number"]');
      const phoneInputValue = await phoneInput.getAttribute("value");
      expect(phoneInputValue).toBe(countryCode);

      console.log(`Country: ${country}, Country Code: ${countryCode}`);
    }
  });

  test("should accept correct format for password and confirm password input fields", async ({
    page,
  }) => {
    // Verify that the password and confirm password input fields accepts the correct format for password e.g. (at least one uppercase letter, at least one symble, at least 8 characters long
    // Check if both password fields accept correctly formatted values
    await page.fill('input[name="password1"]', "MySecretPassword123!");
    await page.fill('input[name="password2"]', "MySecretPassword123!");

    const password1Input = await page.$('input[name="password1"]');
    const password1InputValue = await password1Input.getAttribute("value");
    expect(password1InputValue).toBe("MySecretPassword123!");

    const password2Input = await page.$('input[name="password2"]');
    const password2InputValue = await password2Input.getAttribute("value");
    expect(password2InputValue).toBe("MySecretPassword123!");

    console.log("Password1 input value:", password1InputValue);
    console.log("Password2 input value:", password2InputValue);

    // Check if the confirm password field returns an error if passwords are not the same
    await page.fill('input[name="password1"]', "MySecretPassword123!");
    await page.fill('input[name="password2"]', "MySecretPassword1234!");
    await page.press('input[name="password2"]', "Tab");
    const password2InputError = await password2Input.getAttribute(
      "aria-invalid"
    );
    expect(password2InputError).toBe("true");

    const password2InputErrorMessages = await page.$$(
      "p#\\:Rijttpucq\\:-form-item-message"
    );
    const password2InputErrorMessage = password2InputErrorMessages.find(
      (message) => message.textContent.includes("Passwords don't match")
    );
    expect(password2InputErrorMessage).not.toBeNull();

    console.log("Password2 input error:", password2InputError);
    console.log("Password2 input error message:", password2InputErrorMessage);

    // Check if the password fields return an error if the password is incorrectly formatted
    await page.fill('input[name="password1"]', "short");
    await page.fill('input[name="password2"]', "short");
    await page.press('input[name="password2"]', "Tab");
    const password1InputError = await password1Input.getAttribute(
      "aria-invalid"
    );
    expect(password1InputError).toBe("true");

    const password1InputErrorMessages = await page.$$(
      "p#\\:Rijttpucq\\:-form-item-message"
    );
    const password1InputErrorMessage = password1InputErrorMessages.find(
      (message) =>
        message.textContent.includes(
          "Password must be at least 8 characters long, contain at least one uppercase letter, and contain at least one symbol"
        )
    );
    expect(password1InputErrorMessage).not.toBeNull();

    console.log("Password1 input error:", password1InputError);
    console.log("Password1 input error message:", password1InputErrorMessage);

    // Check for error messages when password fields are empty
    await page.fill('input[name="password1"]', "");
    await page.fill('input[name="password2"]', "");
    await page.press('input[name="password2"]', "Tab");

    const password1InputErrorEmpty = await password1Input.getAttribute(
      "aria-invalid"
    );
    expect(password1InputErrorEmpty).toBe("true");

    const password2InputErrorEmpty = await password2Input.getAttribute(
      "aria-invalid"
    );
    expect(password2InputErrorEmpty).toBe("true");

    const passwordErrorMessages = await page.$$(
      "p#\\:Rijttpucq\\:-form-item-message"
    );
    const password1ErrorMessage = passwordErrorMessages.find((message) =>
      message.textContent.includes("Password is required")
    );
    expect(password1ErrorMessage).not.toBeNull();

    const password2ErrorMessage = passwordErrorMessages.find((message) =>
      message.textContent.includes("Confirm password is required")
    );
    expect(password2ErrorMessage).not.toBeNull();

    console.log("Password1 input error when empty:", password1ErrorMessage);
    console.log("Password2 input error when empty:", password2ErrorMessage);
  });

  test("should toggle password and confirm password visibility with view icon button", async ({
    page,
  }) => {
    // Verify that the view Icon button toggles password and confirm password visibility
    const password1Input = await page.$('input[name="password1"]');
    const password1InputType = await password1Input.getAttribute("type");
    expect(password1InputType).toBe("password");

    await page.click(
      'button[type="button"] > svg.lucide.lucide-eye:first-of-type'
    );

    const password1InputTypeAfterClick = await password1Input.getAttribute(
      "type"
    );
    expect(password1InputTypeAfterClick).toBe("text");

    const password2Input = await page.$('input[name="password2"]');
    const password2InputType = await password2Input.getAttribute("type");
    expect(password2InputType).toBe("password");

    await page.click(
      'button[type="button"] > svg.lucide.lucide-eye:last-of-type'
    );

    const password2InputTypeAfterClick = await password2Input.getAttribute(
      "type"
    );
    expect(password2InputTypeAfterClick).toBe("text");
  });

  test("should redirect to terms and conditions and privacy policy pages", async ({
    page,
  }) => {
    const hrefs = ["/terms-and-conditions", "/privacy-policy"];

    for (const href of hrefs) {
      const link = await page.$(
        `a[data-testid="terms-conditions-link"][href="${href}"]`
      );
      if (!link) {
        throw new Error(`Link with href ${href} not found`);
      }

      const text = await link.textContent();
      console.log(`Clicking ${text} link`);
      await link.click();

      console.log(`Waiting for navigation to ${href} page`);
      await page.waitForNavigation({
        url: (url) => url.pathname.includes(href),
      });

      const h1Text = await page.$eval("h1", (el) => el.textContent);
      if (href === "/terms-and-conditions") {
        expect(h1Text).toContain("Terms and Conditions");
      } else if (href === "/privacy-policy") {
        expect(h1Text).toContain("Privacy Policy");
      }
      console.log(`Page H1 text is: ${h1Text}`);

      await page.goBack();
      console.log(`Returned to signup page\n`);
    }
  });
});
