// @ts-check

import fs from 'node:fs';
import path from 'node:path';

/**
 * Helper function to recursively find all files in a directory
 * @param {string} dirPath
 * @param {string[]} arrayOfFiles
 * @returns
 */
function getAllFilesInFolder(dirPath, arrayOfFiles = []) {
	const files = fs.readdirSync(dirPath);

	files.forEach(function (file) {
		const fullPath = path.join(dirPath, file);
		if (fs.statSync(fullPath).isDirectory()) {
			arrayOfFiles = getAllFilesInFolder(fullPath, arrayOfFiles);
		} else {
			arrayOfFiles.push(fullPath);
		}
	});

	return arrayOfFiles;
}

/**
 * Extract valid keys from the files based on the "m." pattern
 * @param {string[]} files
 * @returns {string[]}
 */
function extractKeysFromFiles(files) {
	const keyRegex = /(^|[^a-zA-Z_])m\.([a-zA-Z_]+)/g;
	// This regex finds all strings between "m." and the next char that is not a letter or an underscore
	// Also, before "m." must be no letters or underscorses

	const validKeys = new Set();

	files.forEach((file) => {
		const fileContent = fs.readFileSync(file, 'utf-8');
		let match;
		while ((match = keyRegex.exec(fileContent)) !== null) {
			validKeys.add(match[2]); // Extract the key between "m." and "("
		}
	});

	return Array.from(validKeys);
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
 * @param {string} jsonFilePath
 */
function main(searchFolder, jsonFilePath) {
	const allFiles = getAllFilesInFolder(searchFolder);
	const validKeys = extractKeysFromFiles(allFiles);
	const json = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
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

main('./src/', './messages/en.json');
