import { z } from 'zod';
import { persisted } from 'svelte-persisted-store';

export const setupSchema = z.object({
	name: z.string(),
	credentialIssuer: z.string(),
	contentJSON: z.string(),
	sealExpirationDate: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\d\d$/)
});

export type MultisignatureFormData = z.infer<typeof setupSchema>;

export const multisignatureFormData = persisted<MultisignatureFormData>('multisignatureFormData', {
	name: '',
	credentialIssuer: '',
	contentJSON: '',
	sealExpirationDate: ''
});
