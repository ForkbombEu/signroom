// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export function readFileAsBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const base64string = (reader.result as string).split(',')[1];
			resolve(base64string);
		};
		reader.onerror = () => {
			reject(reader.error);
		};
	});
}

export function readFileAsString(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = () => {
			const result = (reader.result as string).trim();
			resolve(result);
		};
		reader.onerror = () => {
			reject(reader.error);
		};
	});
}
