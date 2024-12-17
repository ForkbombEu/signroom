// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import yaml from 'js-yaml';
import _ from 'lodash';

try {
	// Example: Running the 'ls' command
	const submodule_status = execSync('git submodule status', { encoding: 'utf-8' });

	const lockfile = yaml.load(fs.readFileSync('./pnpm-lock.yaml', 'utf8'));
	const zenroom_version = _.get(lockfile, "importers['.'].dependencies.zenroom.version");

	const filePath = './src/lib/debug.ts';
	const fileContent = `export default ${JSON.stringify({ submodule_status, zenroom_version }, null, 4)}`;

	fs.writeFileSync(filePath, fileContent);
	console.log('Wrote debug info in:', filePath);
} catch (error) {
	console.error('Error executing command:', error.message);
}
