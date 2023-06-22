import type { ValueOf } from '$lib/utils/types';

export const userQuestionsKeys = {
	question1: 'question1',
	question2: 'question2',
	question3: 'question3',
	question4: 'question4',
	question5: 'question5'
} as const;

export type UserQuestionsKey = ValueOf<typeof userQuestionsKeys>;

export const userQuestions: Array<{ id: UserQuestionsKey; text: string }> = [
	{ id: userQuestionsKeys.question1, text: 'Where did your parents meet?' },
	{ id: userQuestionsKeys.question2, text: 'What is the name of your first pet?' },
	{ id: userQuestionsKeys.question3, text: 'What is your home town?' },
	{ id: userQuestionsKeys.question4, text: 'What is the name of your first teacher?' },
	{ id: userQuestionsKeys.question5, text: 'What is the surname of your mother before wedding?' }
];

export type UserAnswers = Record<UserQuestionsKey, string>;
