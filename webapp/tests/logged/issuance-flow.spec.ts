import { test, expect, Page } from '@playwright/test';
import { createOrganization } from '@utils/organization';
import { nanoid } from 'nanoid';

test.describe('it should create an issuance flow', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		const context = await browser.newContext();
		page = await context.newPage();
		await page.goto('/my');
	});

	test.afterAll(async ({ browser }) => {
		browser.close;
	});

	test('it should create an organization', async () => {
		await createOrganization(page);
	});

	test('it should create a credential issuer', async () => {
		const microservicesLink = page.getByRole('link', { name: 'Microservices' }).first();
		await expect(microservicesLink).toBeVisible({ timeout: 100000 });
		await microservicesLink.click();
		await page.getByRole('button', { name: 'Add new' }).first().click();
		await page.locator('input[name="name"]').click();
		await page.locator('input[name="name"]').fill('credential-issuer-1');
		await page.locator('input[name="endpoint"]').click();
		await page.locator('input[name="endpoint"]').fill('https://www.cred-test.com');
		await page.getByRole('button', { name: 'Create record' }).click();
	});

	test('it should create an authorization server', async () => {
		await page.getByRole('button', { name: 'Add new' }).nth(1).click();
		await page.locator('input[name="name"]').click();
		await page.locator('input[name="name"]').fill('auth-serve-1');
		await page.locator('input[name="name"]').press('Tab');
		await page.locator('input[name="name"]').press('Tab');
		await page.getByText('Endpoint * microservice_endpoint_description').click();
		await page.locator('input[name="endpoint"]').fill('http://www.auth-serv.com');
		await page.getByRole('button', { name: 'Create record' }).click();
	});

	test('it should create an issuance template', async () => {
		const templateName = `issuance-template-${nanoid(5)}`;

		// it should start creating the template

		await page.getByRole('link', { name: 'Templates' }).click();
		await page.getByRole('button', { name: 'New template' }).click();

		await page.locator('select[name="type"]').selectOption('issuance');
		await page.getByPlaceholder('Name of the template').click();
		await page.getByPlaceholder('Name of the template').fill(templateName);
		await page.getByPlaceholder('Template form description').click();
		await page.getByPlaceholder('Template form description').fill('ok good');

		// it should add properties to the template (1)

		await page.getByPlaceholder('property_id').click();
		await page.getByPlaceholder('property_id').fill('name');

		await page.getByPlaceholder('Display name').click();
		await page.getByPlaceholder('Display name').fill('Full Name');

		// it should add properties to the template (2)

		await page.getByRole('button', { name: 'Add property' }).click();
		const secondRow = page.getByRole('row').nth(2);
		await expect(secondRow).toBeVisible();

		await secondRow.getByPlaceholder('property_id').click();
		await secondRow.getByPlaceholder('property_id').fill('age');

		await secondRow.getByPlaceholder('Display name').click();
		await secondRow.getByPlaceholder('Display name').fill('Actual age');

		await secondRow.locator('select').selectOption('integer');

		// it should add properties to the template (3)

		await page.getByRole('button', { name: 'Add property' }).click();
		const thirdRow = page.getByRole('row').nth(3);
		await expect(thirdRow).toBeVisible();

		await thirdRow.getByPlaceholder('property_id').click();
		await thirdRow.getByPlaceholder('property_id').fill('married');

		await thirdRow.getByPlaceholder('Display name').click();
		await thirdRow.getByPlaceholder('Display name').fill('Marriage status');

		await thirdRow.locator('select').selectOption('boolean');

		// it should remove the third property

		await thirdRow.locator('button').click();

		// it should select the other options

		await page.getByText('Is public: This template can').click();

		// it should create the issuance template

		await page.getByRole('button', { name: 'Create template' }).click();
		await expect(page.locator('.fixed > div').first()).toBeHidden();
		await expect(page.getByText(templateName)).toBeVisible();
	});

	test('it should create an authorization template', async () => {
		const templateName = `auth-template-${nanoid(5)}`;

		// it should start creating the template

		await page.getByRole('button', { name: 'New template' }).click();
		await page.locator('select[name="type"]').selectOption('authorization');

		await page.getByPlaceholder('Name of the template').click();
		await page.getByPlaceholder('Name of the template').fill(templateName);

		await page.getByPlaceholder('Template form description').click();
		await page.getByPlaceholder('Template form description').fill('this is a good description');

		// it should select a preset

		await page
			.locator('form div')
			.filter({ hasText: 'Load preset load_preset_description Select optionGeneric HTTP Preset' })
			.getByRole('combobox')
			.selectOption({ index: 1 });

		// // it should add properties to the auth template (1)

		// await page.getByPlaceholder('property_id').first().click();
		// await page.getByPlaceholder('property_id').first().fill('full_name');

		// await page.getByPlaceholder('Display name').first().click();
		// await page.getByPlaceholder('Display name').first().fill('Full Name');

		// // it should add properties to the auth template (2)

		// await page.getByRole('button', { name: 'Add property' }).first().click();
		// const secondRow = page.getByRole('row').nth(2);

		// await secondRow.getByPlaceholder('property_id').fill('age');
		// await secondRow.getByPlaceholder('Display name').click();
		// await secondRow.getByPlaceholder('Display name').fill('Age');
		// await secondRow.locator('select').selectOption('integer');

		// // it should add properties to the form template (1)

		// const thirdRow = page.getByRole('row').nth(4);

		// await thirdRow.getByPlaceholder('property_id').click();
		// await thirdRow.getByPlaceholder('property_id').fill('age');
		// await thirdRow.getByPlaceholder('Display name').click();
		// await thirdRow.getByPlaceholder('Display name').fill('Age');
		// await thirdRow.locator('select').selectOption('integer');

		//

		await page.getByText('Is public: This template can').click();

		// it should create the authorization template

		await page.getByRole('button', { name: 'Create template' }).click();
		await expect(page.locator('.fixed > div').first()).toBeHidden();
		await expect(page.getByText(templateName)).toBeVisible();
	});

	test('it should navigate to issuance flow pages and related', async () => {
		await page.getByRole('link', { name: 'Issuance flows' }).click();
		await expect(page).toHaveURL(/credential-issuances/);
		await page.getByRole('button', { name: 'Credential templates' }).click();
		await expect(page).toHaveURL(/templates/);
		await page.getByRole('button', { name: 'Back to issuance' }).click();
		await expect(page).toHaveURL(/credential-issuances/);
		await page.getByRole('button', { name: 'Authorization templates' }).click();
		await expect(page).toHaveURL(/templates/);
		await page.getByRole('button', { name: 'Back to issuance' }).click();
		await expect(page).toHaveURL(/credential-issuances/);
	});

	test('it should create a new issuance flow', async () => {
		const issuanceFlowName = `issuance-flow-${nanoid(5)}`;

		await page.getByRole('button', { name: 'New issuance flow' }).click();
		await expect(page).toHaveURL(/credential-issuances\/create/);

		await page.getByPlaceholder('Age verification', { exact: true }).fill(issuanceFlowName);
		await page.locator('input[name="type_name"]').click();
		await page.locator('input[name="type_name"]').fill('issuance_test_1');

		await page.getByPlaceholder('Issuance flow for Age').click();
		await page.getByPlaceholder('Issuance flow for Age').fill('Issuance test creation');

		await page.locator('select[name="credential_template"]').selectOption({ index: 1 });
		await page.locator('select[name="authorization_template"]').selectOption({ index: 1 });

		await page.locator('select[name="credential_issuer"]').selectOption({ index: 1 });
		await page.locator('select[name="authorization_server"]').selectOption({ index: 1 });

		await page.getByText('Is public: this credential').click();
		await page.getByRole('button', { name: 'Create issuance flow' }).click();

		await expect(page).toHaveURL(/organizations\/[a-zA-Z0-9]{15}/);
		await expect(page.getByText(issuanceFlowName).first()).toBeVisible();
	});

	test('it should update the issuance flow', async () => {
		await page.getByRole('button', { name: 'Make changes' }).click();
		await expect(page).toHaveURL(/edit/);
		await page.getByPlaceholder('Age verification', { exact: true }).click();
		await page.getByPlaceholder('Age verification', { exact: true }).fill('Issuance Test Updated');
		await page.getByRole('button', { name: 'Update issuance flow' }).click();
		await expect(page).toHaveURL(/organizations\/(?!.*edit)/);
	});
});
