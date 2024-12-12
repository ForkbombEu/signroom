// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import fs from 'fs';
import PocketBase from 'pocketbase';
import 'dotenv/config';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

//

console.log(dirname());

const objectName = 'OrgRoles';
const typeName = 'OrgRole';
const fileName = 'roles.ts';

// Pocketbase setup

const { PB_ADMIN_USER, PB_ADMIN_PASS, PUBLIC_POCKETBASE_URL } = process.env;

const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
await pb.admins.authWithPassword(PB_ADMIN_USER, PB_ADMIN_PASS);

const roles = await pb.collection('orgRoles').getFullList();

// Building file

let file = '';

file += `export const ${objectName} = {\n`;
for (const role of roles) {
	file += `\t${role.name.toUpperCase()}: '${role.name}',\n`;
}
file += '} as const;\n';

file += '\n';
file += `export type ${typeName} = typeof ${objectName} [keyof typeof ${objectName}];`;

const filePath = path.join(dirname(), fileName);
fs.writeFileSync(filePath, file);
console.log(`📦 Generated ${objectName} list in: ${filePath}`);

//

function dirname() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	return __dirname;
}
