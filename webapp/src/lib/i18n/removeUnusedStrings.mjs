// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

import fs from 'node:fs';
import path from 'node:path';

/**
 * Helper function to recursively find all files in a directory
 * @param {string} dirPath
 * @param {string[]} [exclude=[]]
 * @param {string[]} arrayOfFiles
 * @returns
 */
function getAllFilesInFolder(dirPath, exclude = [], arrayOfFiles = []) {
	const files = fs.readdirSync(dirPath);

	files.forEach(function (file) {
		const fullPath = path.join(dirPath, file);
		if (exclude.includes(fullPath)) return;
		if (fs.statSync(fullPath).isDirectory()) {
			arrayOfFiles = getAllFilesInFolder(fullPath, exclude, arrayOfFiles);
		} else {
			arrayOfFiles.push(fullPath);
		}
	});

	return arrayOfFiles;
}

/**
 * Extract used keys from the files based on the "m." pattern
 * @param {string[]} files
 * @param {string[]} keys
 * @returns {string[]}
 */
function getKeysInFiles(files, keys) {
	const usedKeys = new Set();

	files.forEach((file) => {
		const fileContent = fs.readFileSync(file, 'utf-8');
		keys.filter((k) => fileContent.includes(k)).forEach((k) => usedKeys.add(k));
	});

	return Array.from(usedKeys);
}

/**
 * Filter the JSON file by removing keys not present in the valid keys list
 * @param {Record<string,string>} json
 * @param {string[]} validKeys
 * @returns {Record<string,string>}
 */
function filterJsonByKeys(json, validKeys) {
	/** @type {Record<string,string>}  */
	const newJson = {};

	const SCHEMA_KEY = '$schema';
	if (SCHEMA_KEY in json) {
		newJson[SCHEMA_KEY] = json[SCHEMA_KEY];
	}

	Object.keys(json).forEach((key) => {
		if (validKeys.includes(key)) {
			newJson[key] = json[key];
		}
	});

	return newJson;
}

/**
 * Main function to extract keys and filter the JSON
 * @param {string} searchFolder
 * @param {string[]} exclude
 * @param {string} jsonFilePath
 */
function main(searchFolder, exclude, jsonFilePath) {
	const allFiles = getAllFilesInFolder(searchFolder, exclude);
	const json = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
	const keys = Object.keys(json);
	const validKeys = getKeysInFiles(allFiles, keys);
	const filteredJson = filterJsonByKeys(json, validKeys);
	fs.writeFileSync(jsonFilePath, JSON.stringify(filteredJson, null, 2));
	console.log(`Removed unused strings ✨`);
}

// // Run the script with folder and JSON file arguments
// const searchFolder = process.argv[2];
// const jsonFilePath = process.argv[3];

// if (!searchFolder || !jsonFilePath) {
//   console.log('Usage: node script.js <searchFolder> <jsonFilePath>');
//   process.exit(1);
// }

main('./src/', ['src/paraglide'], './messages/en.json');
