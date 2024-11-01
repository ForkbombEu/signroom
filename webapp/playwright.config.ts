import type { PlaywrightTestConfig } from '@playwright/test';
export const storageState = 'playwright/.auth/user.json';

const config: PlaywrightTestConfig = {
	projects: [
		{ name: 'setup', testMatch: /.*\.setup\.ts/ },
		{
			name: 'nruTests',
			testMatch: /nru\/.*\.spec\.ts/,
			use: {
				video: 'retain-on-failure'
			}
		},
		{
			name: 'loggedTests',
			testMatch: /logged\/.*\.spec\.ts/,
			use: {
				video: 'retain-on-failure',
				storageState
			},
			dependencies: ['setup']
		}
	],
	webServer: {
		command: 'npm run preview',
		port: 4173,
		reuseExistingServer: true
	},
	testDir: 'tests',
};

export default config;
