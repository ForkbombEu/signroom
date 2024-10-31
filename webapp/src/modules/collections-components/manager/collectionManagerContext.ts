import type { CollectionFormOptions } from '@/collections-components/form';
import type { CollectionName } from '@/pocketbase/collections-models/types';
import type { RecordService } from 'pocketbase';
import type { InverseExpandProp, ExpandProp } from '../types';
import type { Writable } from 'svelte/store';
import type { RecordIdString } from '@/pocketbase/types';
import { getContext } from 'svelte';

//

export type CollectionManagerContext<
	C extends CollectionName,
	Expand extends ExpandProp<C> = never,
	InverseExpand extends InverseExpandProp = never
> = {
	collection: CollectionName;
	recordService: RecordService;
	fetchOptions: Writable<Partial<FetchOptions<C, Expand, InverseExpand>>>;
	paginationContext: PaginationContext;
	selectionContext: {
		selectedRecords: Writable<RecordIdString[]>;
		areAllRecordsSelected: (selectedRecords: RecordIdString[]) => boolean;
		toggleSelectAllRecords: () => void;
		discardSelection: () => void;
	};
	formsOptions: Record<FormPropType, CollectionFormOptions<C>>;
};

export const COLLECTION_MANAGER_KEY = Symbol('cmk');

export function getCollectionManagerContext<
	C extends CollectionName
>(): CollectionManagerContext<C> {
	return getContext(COLLECTION_MANAGER_KEY);
}

//

export type FetchOptions<
	C extends CollectionName,
	Expand extends ExpandProp<C> = never,
	InverseExpand extends InverseExpandProp = never
> = {
	subscribe: CollectionName[];
	expand: Expand;
	inverseExpand: InverseExpand;
	filter: string;
	sort: string;
	perPage: number | false;
};

type PaginationContext = {
	currentPage: Writable<number | undefined>;
	totalItems: Writable<number | undefined>;
};

type FormPropType = 'base' | 'create' | 'edit';
