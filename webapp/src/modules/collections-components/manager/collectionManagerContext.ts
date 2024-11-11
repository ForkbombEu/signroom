import type { CollectionFormOptions } from '@/collections-components/form';
import type { CollectionName } from '@/pocketbase/collections-models';
import type { RecordService } from 'pocketbase';
import type { Writable } from 'svelte/store';
import type { RecordIdString } from '@/pocketbase/types';
import { getContext } from 'svelte';
import type { PocketbaseQuery, ExpandQueryOption } from '@/pocketbase/query';

//

export type CollectionManagerContext<
	C extends CollectionName,
	Expand extends ExpandQueryOption<C> = never
> = {
	collection: CollectionName;
	recordService: RecordService;
	pocketbaseQuery: Writable<PocketbaseQuery<C, Expand>>;
	paginationContext: PaginationContext;
	selectionContext: {
		selectedRecords: Writable<RecordIdString[]>;
		areAllRecordsSelected: (selectedRecords: RecordIdString[]) => boolean;
		toggleSelectAllRecords: () => void;
		discardSelection: () => void;
	};
	formsOptions: Record<FormPropType, CollectionFormOptions<C>>;
};

type PaginationContext = {
	currentPage: Writable<number | undefined>;
	totalItems: Writable<number | undefined>;
};

type FormPropType = 'base' | 'create' | 'edit';

//

export const COLLECTION_MANAGER_KEY = Symbol('cmk');

export function getCollectionManagerContext<
	C extends CollectionName
>(): CollectionManagerContext<C> {
	return getContext(COLLECTION_MANAGER_KEY);
}
