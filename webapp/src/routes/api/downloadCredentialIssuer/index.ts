import { objectSchemaValidator } from '$lib/jsonSchema/types';
import { z } from 'zod';

//

export const requestBodySchema = z.object({
	credential_issuer_url: z.string(),
	credential_issuer_name: z.string(),
	authorization_server_url: z.string(),
	credential_template: objectSchemaValidator,
	authorization_form_template: z.any(),
	authorization_data_template: z.any(),
	credential_display_name: z.string(),
	credential_type_name: z.string(),
	credential_logo: z.string().nullish(),
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
