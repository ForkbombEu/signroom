import type { ObjectSchema } from '$lib/jsonSchema/types';
import { z } from 'zod';

//

export const objectSchemaValidator = z.custom<ObjectSchema>(
	(value) =>
		z
			.object({
				type: z.literal('object'),
				properties: z.record(z.string(), z.unknown()),
				required: z.array(z.string()).optional()
			})
			.safeParse(value).success
);

export const requestBodySchema = z.object({
	credential_issuer_url: z.string().url(),
	authorization_server: z.string().url(),
	credential_name: z.string(), // Generate from service name
	credential_issuer_name: z.string(), // Generate from organization name
	templates: z.array(objectSchemaValidator) // List of JSON schemas
});

//

export type RequestBody = z.infer<typeof requestBodySchema>;

export function request(body: RequestBody, fetchFn = fetch) {
	return fetchFn('/api/downloadCredentialIssuer', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'content-type': 'application/json'
		}
	});
}
