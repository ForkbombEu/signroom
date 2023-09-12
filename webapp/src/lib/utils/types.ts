import type { BaseSystemFields } from '$lib/pocketbase/types';
import type { XCircle } from 'svelte-heros-v2';

export type ValueOf<T> = T[keyof T];

export type Link = {
	href: string;
	text: string;
};

export type PBRecord = Record<string, unknown>;
export type PBResponse<T extends PBRecord = PBRecord, R = unknown> = T & BaseSystemFields<R>;
export type PBResponseKeys<T> = Extract<keyof T, string>;

export type IconComponent = typeof XCircle;
