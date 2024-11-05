// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ObjectSchema } from '$lib/jsonSchema/types';
import { z } from 'zod';
import { DEFAULT_LOCALE } from './locale';
import _ from 'lodash';

//

export function mergeObjectSchemas(schemas: ObjectSchema[]): ObjectSchema {
	return {
		type: 'object',
		properties: _.merge({}, ...schemas.map((s) => s.properties)),
		required: _.concat(...schemas.map((s) => s.required ?? []))
	};
}

export function mergeObjectSchemasIntoClaims(
	schemas: ObjectSchema[],
	locale = DEFAULT_LOCALE
): Claims {
	const claims = schemas.map((s) => objectSchemaToClaims(s, locale));
	return _.merge({}, ...claims);
}

/* JSON Schema to Claims conversion */

export function objectSchemaToClaims(
	schema: ObjectSchema,
	locale = DEFAULT_LOCALE
): Claims {
	const claims: Claims = {};

	for (const [propertyName, property] of Object.entries(schema.properties)) {
		//
		if (property.type != 'object' && property.type != 'array') {
			//
			const prop: ClaimsProperty = {
				mandatory: Boolean(schema.required?.includes(propertyName)),
				display: [{ locale, name: property.title ?? propertyName }]
			};
			claims[propertyName] = prop;
		}
		//
		else if (property.type === 'object') {
			claims[propertyName] = objectSchemaToClaims(property, locale);
		}
		//
		else {
			console.log(`Property not handled:`);
			console.log(JSON.stringify(property, null, 2));
		}
	}
	return claims;
}

// https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#name-credential-issuer-metadata-2

export type Claims = {
	[key: string]: Claims | ClaimsProperty;
};

const DisplayPropertiesSchema = z.object({
	name: z.string(),
	locale: z.string()
});

type DisplayProperties = {
	name: string;
	locale: string;
};

const ClaimsPropertySchema = z.object({
	mandatory: z.boolean(),
	display: z.array(DisplayPropertiesSchema).optional()
});

export type ClaimsProperty = {
	mandatory?: boolean;
	display?: DisplayProperties[];
	// TODO - Handle "type" property if necessary
};

//

function checkClaimsProperty(data: unknown): data is ClaimsProperty {
	return ClaimsPropertySchema.safeParse(data).success;
}

export function flattenClaimsProperties(
	claims: Claims
): [string, ClaimsProperty][] {
	let propertyList: [string, ClaimsProperty][] = [];

	Object.entries(claims).forEach(([propertyName, property]) => {
		if (checkClaimsProperty(property)) {
			propertyList.push([propertyName, property]);
		}
		//
		else {
			const nestedProperties = flattenClaimsProperties(property).map(
				([nestedPropertyName, nestedProperty]) =>
					[`${propertyName}.${nestedPropertyName}`, nestedProperty] as [
						string,
						ClaimsProperty
					]
			);
			propertyList = [...propertyList, ...nestedProperties];
		}
	});

	return propertyList;
}

/* */

const credential_configuration_template = {
	format: 'vc+sd-jwt',
	cryptographic_binding_methods_supported: ['jwk', 'did:dyne:sandbox.signroom'],
	credential_signing_alg_values_supported: ['ES256'],
	proof_types_supported: {
		jwt: {
			proof_signing_alg_values_supported: ['ES256']
		}
	},
	display: [
		{
			name: '',
			locale: '',
			logo: {
				url: '',
				alt_text: '',
				uri: ''
			},
			background_color: '',
			text_color: '',
			description: ''
		}
	],
	vct: '',
	claims: {}
};

export function get_credential_configuration_template() {
	return _.cloneDeep(credential_configuration_template);
}
