import type { BaseSystemFields } from '$lib/pocketbase/types';
import type { XCircle } from 'svelte-heros-v2';

export type ValueOf<T> = T[keyof T];

export type Link = {
	href: string;
	text: string;
};

//

export type PBRecord = Record<string, unknown>;
export type PBExpand<T extends PBRecord = PBRecord> = Record<string, T | T[]>;

export type PBResponse<R extends PBRecord = PBRecord, E extends PBExpand = PBExpand> = R &
	BaseSystemFields<E>;

export type PBResponseKeys<T> = Extract<keyof T, string>;

export type IconComponent = typeof XCircle;
