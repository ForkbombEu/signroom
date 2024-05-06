// @ts-check
import { expect, test } from "@playwright/test";
import fs from "fs/promises";
import path from "path";

const username = "user@forkbomb.eu";
const password = "user@forkbomb.eu";
const answers = ["Paris", "Bobby", "Bangkok"];
const authFile = "playwright/.auth/user.json";

export const login = async (page) => {
  await page.goto("/login");
  await page.getByPlaceholder("name@email.com").click();
  await page.getByPlaceholder("name@email.com").fill(username);
  await page.getByPlaceholder("•••••").click();
  await page.getByPlaceholder("•••••").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByText("Regenerate private keys You").click();
  await page
    .getByRole("link", { name: 'Forgot the "seed"? Regenerate' })
    .click();
  await page.waitForURL("/keypairoom");
  await page.locator('input[name="questions\\.question1"]').click();
  await page.locator('input[name="questions\\.question1"]').fill(answers[0]);
  await page.locator('input[name="questions\\.question1"]').press("Tab");
  await page.locator('input[name="questions\\.question2"]').fill(answers[1]);
  await page.locator('input[name="questions\\.question2"]').press("Tab");
  await page.locator('input[name="questions\\.question3"]').fill(answers[2]);
  await page.getByRole("button", { name: "Generate private keys" }).click();
  await page.getByRole("link", { name: "Go to Dashboard" }).click();
  await page.context().storageState({ path: authFile });
};

/**
 *  A convenience method that handles gracefully cleaning up the test run.
 */
export const saveVideoTutorial = async (page, context, videoTitle) => {
  if (context) await context.close();
  const video = page.video();
  const videoDir = path.resolve(__dirname, "videos");
  const videoPath = await video?.path();

  if (video && videoPath) {
    await fs.rename(videoPath, `${videoDir}/${videoTitle}.webm`);
  }
};

test("make all the screenshots", async ({ page }) => {
  await page.goto("/register");
  await page.screenshot({ path: "screens/register.png", fullPage: true });
});

test("how to setup did on pb", async ({ page, context }) => {
  await page.goto("http://localhost:8090/_/");
  await page.goto("http://localhost:8090/_/#/login");
  await page.getByLabel("Email").fill("admin@example.org");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("adminadmin");
  await page.getByRole("button", { name: "Login " }).click();
  await page.getByRole("link", { name: " features Pin collection" }).click();
  await page.getByText('{"DID_IDENTITY":"string').click();
  await page.getByText('"string"', { exact: true }).nth(1).click();
  await page.getByText('{ "DID_IDENTITY": "stri').press("ArrowRight");
  await page
    .getByText('{ "DID_IDENTITY": "stri')
    .fill(
      '{\n  "DID_IDENTITY": "string",\n  "DID_KEYRING": "json, currently passed base64 encoded",\n  "DID_SIGNER_SPEC": "string",\n  "DID_SPEC": "string",\n  "DID_URL": "url"\n}'
    );
  await expect(page.getByText('{"DID_IDENTITY":"stri')).toBeVisible();
  saveVideoTutorial(page, context, "setup-did");
});
test.describe("Flows", () => {
  test.describe.configure({ mode: "serial" });

  test("Register a user", async ({ page, context }) => {
    await page.goto("/");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Register arrow right" })
      .click();
    await page.getByPlaceholder("name@email.com").click();
    await page.getByPlaceholder("name@email.com").fill(username);
    await page.getByPlaceholder("John Doe").click();
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="password"]').press("Tab");
    await page.locator('input[name="passwordConfirm"]').fill(password);
    await page.getByLabel("").check();
    await page.getByLabel("").press("Tab");
    await page.getByRole("link", { name: "Terms and Conditions" }).press("Tab");
    await page.getByRole("button", { name: "Create an account" }).click();
    await page.locator('input[name="questions\\.question1"]').click();
    await page.locator('input[name="questions\\.question1"]').fill(answers[0]);
    await page.locator('input[name="questions\\.question1"]').press("Tab");
    await page.locator('input[name="questions\\.question2"]').fill(answers[1]);
    await page.locator('input[name="questions\\.question2"]').press("Tab");
    await page.locator('input[name="questions\\.question3"]').fill(answers[2]);
    await page.getByRole("button", { name: "Generate private keys" }).click();
    await page.getByRole("link", { name: "Go to Dashboard" }).click();
    await page.context().storageState({ path: authFile });
    saveVideoTutorial(page, context, "registration");
  });

  test("Register an organization", async ({ page, context }) => {
    await login(page);
    await page
      .getByRole("link", { name: "rectangle stack My organizations" })
      .click();
    await page
      .getByRole("link", { name: "Create a new organization plus" })
      .click();
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill("Book club");
    await page.getByLabel("Avatar").click();
    await page
      .getByLabel("Avatar")
      .setInputFiles("./assets/600px-Vanamo_Logo.png");
    await page.locator('textarea[name="description"]').click();
    await page
      .locator('textarea[name="description"]')
      .fill("Book club organization");
    await page.getByRole("button", { name: "Create organization" }).click();
    saveVideoTutorial(page, context, "create_organization");
  });

  test("Create a credential issuer microservice", async ({ page, context }) => {
    await login(page);
    await page.getByRole("button", { name: "Book club" }).click();
    await page.getByRole("link", { name: "Microservices" }).click();
    await page.getByRole("button", { name: "Add new plus" }).first().click();
    await page.locator('input[name="name"]').click();
    await page
      .locator('input[name="name"]')
      .fill("Forkbomb Credential Issuer 1");
    await page.locator('input[name="endpoint"]').click();
    await page
      .locator('input[name="endpoint"]')
      .fill("https://issuer1.zenswarm.forkbomb.eu/credential_issuer/");
    await page.getByRole("button", { name: "Create record" }).click();
    saveVideoTutorial(page, context, "create_credential_issuer");
  });

  test("Create an authorization server microservice", async ({
    page,
    context,
  }) => {
    await login(page);
    await page.getByRole("button", { name: "Book club" }).click();
    await page.getByRole("link", { name: "Microservices" }).click();
    await page.getByRole("button", { name: "Add new plus" }).nth(1).click();

    await page.locator('input[name="name"]').click();
    await page
      .locator('input[name="name"]')
      .fill("Forkbomb's Authorization server 1");
    await page.locator('input[name="endpoint"]').click();
    await page
      .locator('input[name="endpoint"]')
      .fill("https://authz-server1.zenswarm.forkbomb.eu/authz_server/");
    await page.getByRole("button", { name: "Create record" }).click();
    saveVideoTutorial(page, context, "create_authz_server");
  });

  test("Issuance flow", async ({ page, context }) => {
    await login(page);
    await page.getByRole("button", { name: "Book club" }).click();
    await page.getByRole("link", { name: "Issuance flows" }).click();
    await page.getByRole("link", { name: "New issuance flow plus" }).click();
    await page.getByPlaceholder("Age verification", { exact: true }).click();
    await page
      .getByPlaceholder("Age verification", { exact: true })
      .fill("Proof of humanity");
    await page.locator('input[name="type_name"]').click();
    await page.locator('input[name="type_name"]').fill("Auth1");
    await page.getByPlaceholder("Issuance flow for Age").click();
    await page
      .getByPlaceholder("Issuance flow for Age")
      .fill(
        "You can use this credential to prove your identity as name and surname, and to prove that you are a real human being"
      );
    await page.getByPlaceholder("https://website.org/image.png").click();
    await page
      .getByPlaceholder("https://website.org/image.png")
      .fill("https://avatars.githubusercontent.com/u/96812851");
    await page
      .getByRole("button", { name: "New credential template plus" })
      .click();
    await page.getByPlaceholder("Name of the template").click();
    await page
      .getByPlaceholder("Name of the template")
      .fill("Proof of humanity access to book club");
    await page.getByPlaceholder("Template form description").click();
    await page
      .getByPlaceholder("Template form description")
      .fill(
        "Use this template when you want to issue a credential for the book club"
      );
    await page.getByPlaceholder("property_id").click();
    await page.getByPlaceholder("property_id").fill("given_name");
    await page.getByPlaceholder("Display name").click();
    await page.getByPlaceholder("Display name").fill("Current First Name");
    await page.getByRole("button", { name: "plus Add property" }).click();
    await page.getByPlaceholder("property_id").nth(1).click();
    await page.getByPlaceholder("property_id").nth(1).fill("family_name");
    await page.getByPlaceholder("Display name").nth(1).click();
    await page
      .getByPlaceholder("Display name")
      .nth(1)
      .fill("Current Family Name");
    await page.getByRole("button", { name: "plus Add property" }).click();
    await page.getByPlaceholder("property_id").nth(2).click();
    await page.getByPlaceholder("property_id").nth(2).fill("is_human");
    await page.getByPlaceholder("Display name").nth(2).click();
    await page
      .getByPlaceholder("Display name")
      .nth(2)
      .fill("Proof of humanity");
    await page
      .getByLabel(
        "Is public: This template can be used also by other organizations",
        { exact: true }
      )
      .check();
    await page.getByRole("button", { name: "Create template" }).click();
    await page
      .getByRole("button", { name: "New authorization template" })
      .click();
    await page.getByPlaceholder("Name of the template").click();
    await page
      .getByPlaceholder("Name of the template")
      .fill("Book club authorization template");
    await page.getByPlaceholder("Template form description").click();
    await page
      .getByPlaceholder("Template form description")
      .fill(
        "This template hold attributes and logic to access correctly the users and allow credential issuance"
      );
    await page.getByPlaceholder("property_id").nth(0).click();
    await page.getByPlaceholder("property_id").nth(0).fill("user_id");
    await page.getByPlaceholder("Display name").nth(0).click();
    await page.getByPlaceholder("Display name").nth(0).fill("User");
    await page.getByPlaceholder("property_id").nth(1).click();
    await page.getByPlaceholder("property_id").nth(1).fill("did");
    await page.getByPlaceholder("Display name").nth(1).click();
    await page.getByPlaceholder("Display name").nth(1).fill("DID");
    await page
      .getByRole("button", { name: "plus Add property" })
      .nth(1)
      .click();
    await page.getByPlaceholder("property_id").nth(2).click();
    await page.getByPlaceholder("property_id").nth(2).fill("crypto_challenge");
    await page.getByPlaceholder("Display name").nth(2).click();
    await page.getByPlaceholder("Display name").nth(2).fill("Crypto challenge");
    await page
      .getByRole("button", { name: "plus Add property" })
      .nth(1)
      .click();
    await page.getByPlaceholder("property_id").nth(3).click();
    await page.getByPlaceholder("property_id").nth(3).fill("given_name");
    await page.getByPlaceholder("Display name").nth(3).click();
    await page
      .getByPlaceholder("Display name")
      .nth(3)
      .fill("Current First Name");
    await page
      .getByRole("button", { name: "plus Add property" })
      .nth(1)
      .click();
    await page.getByPlaceholder("property_id").nth(4).click();
    await page.getByPlaceholder("property_id").nth(4).fill("family_name");
    await page.getByPlaceholder("Display name").nth(4).click();
    await page
      .getByPlaceholder("Display name")
      .nth(4)
      .fill("Current Family Name");
    await page
      .getByRole("button", { name: "plus Add property" })
      .nth(1)
      .click();
    await page.getByPlaceholder("property_id").nth(5).click();
    await page.getByPlaceholder("property_id").nth(5).fill("is_human");
    await page.getByPlaceholder("Display name").nth(5).click();
    await page
      .getByPlaceholder("Display name")
      .nth(5)
      .fill("Proof of humanity");
    await page.getByLabel("New authorization template").locator("form").click();
    await page
      .getByLabel(
        "Is public: This template can be used also by other organizations",
        { exact: true }
      )
      .check();
    await page.getByRole("button", { name: "Create template" }).click();
    await page
      .locator('select[name="credential_issuer"]')
      .selectOption({ index: 0 });
    await page
      .locator('select[name="authorization_server"]')
      .selectOption({ index: 0 });
    await page.getByLabel("Is public: this credential").check();
    await page.getByRole("button", { name: "Create issuance flow" }).click();
    saveVideoTutorial(page, context, "issuance_flow");
  });
});
