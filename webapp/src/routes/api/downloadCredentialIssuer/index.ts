import { objectSchemaValidator } from '$lib/jsonSchema/types';
import { z } from 'zod';

//

export const requestBodySchema = z.object({
	credential_issuer_url: z.string().url(),
	authorization_server_url: z.string().url(),
	credential_template: objectSchemaValidator,
	authorization_form_template: objectSchemaValidator,
	authorization_data_template: objectSchemaValidator,
	credential_display_name: z.string(),
	credential_type_name: z.string(),
	organization_name: z.string(),
	credential_logo: z.string().url().nullish(),
	credential_description: z.string()
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
