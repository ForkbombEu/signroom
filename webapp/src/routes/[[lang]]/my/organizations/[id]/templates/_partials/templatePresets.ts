// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ObjectSchema } from '$lib/jsonSchema/types';
import type { SelectOptionType } from 'flowbite-svelte';

export type TemplatePreset = {
	name: string;
	zencode_script: string;
	zencode_data: string;
	schema: ObjectSchema;
	schema_secondary: ObjectSchema;
};

const preset_1: TemplatePreset = {
	name: 'Generic HTTP Preset',
	zencode_script: `Given nothing\nThen print the string 'yes'`,
	zencode_data: `{\n  "myKey": "myValue"\n}`,
	schema: {
		type: 'object',
		properties: {
			email: {
				type: 'string',
				title: 'email'
			},
			password: {
				type: 'string',
				title: 'password'
			}
		},
		required: ['email', 'password']
	},
	schema_secondary: {
		type: 'object',
		properties: {},
		required: []
	}
};

const templatePresets = [preset_1];

export const templatePresetOptions: SelectOptionType<TemplatePreset>[] = templatePresets.map(
	(preset) => ({
		name: preset.name,
		value: preset
	})
);
