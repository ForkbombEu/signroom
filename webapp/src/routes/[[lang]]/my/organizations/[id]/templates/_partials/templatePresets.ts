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
			did: {
				type: 'string'
			}
		},
		required: ['did']
	},
	schema_secondary: {
		type: 'object',
		properties: {
			email: {
				type: 'string'
			},
			password: {
				type: 'string'
			}
		},
		required: ['email', 'password']
	}
};

const templatePresets = [preset_1];

export const templatePresetOptions: SelectOptionType<TemplatePreset>[] = templatePresets.map(
	(preset) => ({
		name: preset.name,
		value: preset
	})
);
