<script lang="ts" generics="C extends CollectionName, Expand extends ExpandQueryOption<C> = never">
	import {
		type PocketbaseQueryOptions,
		type ExpandQueryOption,
		type QueryResponse,
		PocketbaseQuery
	} from '@/pocketbase/query';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import { createRecordDisplay } from './utils';
	import Search from '@/components/custom/search.svelte';
	import type { SearchFunction } from '@/components/custom/search.svelte';
	import type { CollectionRecords } from '@/pocketbase/types';
	import type { RecordPresenter } from './utils';

	//

	export let collection: C;
	export let queryOptions: Partial<PocketbaseQueryOptions<C, Expand>> = {};

	export let disabled = false;
	export let label: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	export let onSelect: (record: QueryResponse<C, Expand>) => void = () => {};

	export let displayFields: (keyof CollectionRecords[C])[] | undefined = undefined;
	export let displayFn: RecordPresenter<QueryResponse<C, Expand>> | undefined = undefined;

	//

	$: pocketbaseQuery = new PocketbaseQuery(collection, queryOptions);
	$: searchFunction = createSearchFunction(pocketbaseQuery);

	function createSearchFunction(
		pocketbaseQuery: PocketbaseQuery<C, Expand>
	): SearchFunction<QueryResponse<C, Expand>> {
		return async (text: string | undefined) => {
			pocketbaseQuery.options.search = text;
			const records = await pocketbaseQuery.getFullList();

			return records.map((item) => ({
				value: item,
				label: createRecordDisplay(item, displayFields, displayFn),
				disabled: false
			}));
		};
	}

	//

	// function typeCaster(value: unknown): CollectionRecords[C] {
	// 	return value as CollectionRecords[C];
	// }
</script>

<Search searchFn={searchFunction} {onSelect} {label} {placeholder} {disabled} />

<!-- <svelte:fragment slot="item" let:item>
		<slot name="item" item={typeCaster(item)}></slot>
</svelte:fragment> -->
