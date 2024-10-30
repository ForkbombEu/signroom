import type { CollectionFieldOptions } from '@/collections-components/collectionField.svelte';
import type { FieldComponentProp } from './fieldComponent';
import type { CollectionName } from '@/pocketbase/collections-models/types';
import type {
	CollectionRecords,
	CollectionResponses,
	CollectionRelatedCollections as Related
} from '@/pocketbase/types';
import type { ExpandProp } from '../types';
import type { KeyOf, MaybePromise } from '@/utils/types';
import type { ComponentProps } from 'svelte';
import type { CollectionForm } from '.';

/* Fields */

export type FieldsOptions<C extends CollectionName, R = CollectionRecords[C]> = {
	labels: { [K in keyof R]?: string };
	descriptions: { [K in keyof R]?: string };
	placeholders: { [K in keyof R]?: string };
	order: Array<KeyOf<R>>;
	exclude: Array<KeyOf<R>>;
	hide: { [K in keyof R]?: R[K] };
	defaults: { [K in keyof R]?: R[K] };
	relations: {
		[K in keyof Related[C]]?: BaseCollectionFieldOptions<Related[C][K] & CollectionName>;
	};
	components: { [K in keyof R]?: FieldComponentProp };
};

type BaseCollectionFieldOptions<C extends CollectionName> = CollectionFieldOptions<
	C,
	ExpandProp<C>
>;

export function defaultFieldsOptions<C extends CollectionName>(): FieldsOptions<C> {
	return {
		order: [],
		exclude: [],
		defaults: {},
		labels: {},
		placeholders: {},
		descriptions: {},
		hide: {},
		relations: {},
		components: {}
	};
}

/* UI */

export type UIOptions = {
	submitButtonText?: string | undefined;
	showCancelButton?: boolean;
	hideRequiredIndicator?: boolean;
	triggerToast?: boolean;
	toastText?: string;
};

export function defaultUIOptions(): UIOptions {
	return {
		submitButtonText: undefined,
		showCancelButton: false,
		hideRequiredIndicator: false
	};
}

/*  */

export type CollectionFormMode = 'create' | 'edit';

export type OnCollectionFormSuccess<C extends CollectionName> = (
	record: CollectionResponses[C],
	mode: CollectionFormMode
) => MaybePromise<void>;

//

export type CollectionFormOptions<C extends CollectionName> = Pick<
	ComponentProps<CollectionForm<C>>,
	'fieldsOptions' | 'superformsOptions' | 'uiOptions'
>;
