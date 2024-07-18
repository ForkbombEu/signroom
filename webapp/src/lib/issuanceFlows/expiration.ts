import { z } from 'zod';
import { unixNow } from './utils';
import { m } from '$lib/i18n';

//

export const expirationModeSchema = z.enum(['date', 'duration']);

export type ExpirationMode = z.infer<typeof expirationModeSchema>;

//

export const durationSchema = z.object({
	years: z.number().min(0),
	months: z.number().min(0),
	days: z.number().min(0)
});

export type Duration = z.infer<typeof durationSchema>;

//

export const expirationDurationSchema = z.object({
	mode: z.literal(expirationModeSchema.Values.duration).default('duration'),
	duration: durationSchema
		.default({
			years: 0,
			days: 0,
			months: 0
		})
		.refine(
			(value) => {
				return value.days + value.months + value.years > 0;
			},
			{ message: m.Please_add_at_least_one_day() }
		)
});

export type ExpirationDuration = z.infer<typeof expirationDurationSchema>;

//

export const expirationDateSchema = z.object({
	mode: z.literal(expirationModeSchema.Values.date).default('date'),
	date: z
		.number()
		.default(unixNow())
		.refine((value) => unixNow() < value, { message: m.Date_must_be_after_today() })
});

export type ExpirationDate = z.infer<typeof expirationDateSchema>;

//

export const expirationSchema = z.discriminatedUnion('mode', [
	expirationDurationSchema,
	expirationDateSchema
]);

export type Expiration = z.infer<typeof expirationSchema>;
