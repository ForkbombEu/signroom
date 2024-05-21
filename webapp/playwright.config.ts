import type { PlaywrightTestConfig } from '@playwright/test';
export const storageState = 'playwright/.auth/user.json';

const config: PlaywrightTestConfig = {
	projects: [
		{ name: 'setup', testMatch: /.*\.setup\.ts/ },
		{
			name: 'nruTests',
			testMatch: /nru\/.*\.spec\.ts/
		},
		{
			name: 'loggedTests',
			testMatch: /logged\/.*\.spec\.ts/,
			use: { storageState },
			dependencies: ['setup']
		}
	],
	webServer: {
		command: process.env.CI ? 'npm run preview' : 'npm run dev',
		port: process.env.CI ? 4173 : 5173,
		reuseExistingServer: true,
	},
	testDir: 'tests'
};

export default config;
