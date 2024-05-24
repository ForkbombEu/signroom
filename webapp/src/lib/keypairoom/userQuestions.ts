import { z } from 'zod';
import _ from 'lodash';
import { m } from '$lib/i18n';

//

const ZENROOM_NULL = 'null';

export const userChallengesSchema = z
	.object({
		whereParentsMet: z.string().default(''),
		nameFirstPet: z.string().default(''),
		whereHomeTown: z.string().default(''),
		nameFirstTeacher: z.string().default(''),
		nameMotherMaid: z.string().default('')
	})
	.partial()
	.transform(
		(obj) =>
			_.mapValues(obj, (v) => {
				if (typeof v == 'string' && v.length >= 1) return v;
				else return ZENROOM_NULL;
			}) as Required<typeof obj>
	)
	.refine((v) => {
		return Object.values(v).filter((v) => v === ZENROOM_NULL).length <= 2;
	}, 'AT_LEAST_THREE_QUESTIONS');

export type UserChallenges = z.infer<typeof userChallengesSchema>;
export type UserChallenge = keyof UserChallenges;

export const userChallenges: Array<{ id: UserChallenge; text: string }> = [
	{ id: 'whereParentsMet', text: m.whereParentsMet() },
	{ id: 'nameFirstPet', text: m.nameFirstPet() },
	{ id: 'whereHomeTown', text: m.whereHomeTown() },
	{ id: 'nameFirstTeacher', text: m.nameFirstTeacher() },
	{ id: 'nameMotherMaid', text: m.nameMotherMaid() }
];
