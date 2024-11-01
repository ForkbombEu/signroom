<script lang="ts" generics="C extends CollectionName, Expand extends ExpandProp<C> = never">
	import type { CollectionName } from '@/pocketbase/collections-models';
	import { searchTextFilter, excludeIdsFilter, mergeFilters, createRecordDisplay } from './utils';
	import Search from '@/components/custom/search.svelte';
	import type { SearchFunction } from '@/components/custom/search.svelte';
	import type { ExpandableResponse, ExpandProp } from './types';
	import type { CollectionRecords, RecordIdString } from '@/pocketbase/types';
	import type { RecordPresenter } from './utils';
	import type { RecordFullListOptions } from 'pocketbase';
	import { pb } from '@/pocketbase';

	//

	export let collection: C;
	export let expand: Expand | undefined = undefined;

	export let exclude: RecordIdString[] = [];
	export let disabled = false;
	export let filter: string | undefined = undefined;
	export let label: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	export let onSelect: (record: ExpandableResponse<C, Expand>) => void = () => {};

	export let displayFields: (keyof CollectionRecords[C])[] | undefined = undefined;
	export let displayFn: RecordPresenter<ExpandableResponse<C, Expand>> | undefined = undefined;
	//

	type R = ExpandableResponse<C, Expand>;

	function createSearchFunction(
		exclude: RecordIdString[] = [],
		filter: string | undefined = undefined,
		expand: Expand = [] as unknown as Expand
	): SearchFunction<R> {
		return async (text: string | undefined) => {
			const options: RecordFullListOptions = {
				requestKey: null
			};
			if (exclude.length > 0) options.filter = excludeIdsFilter(exclude);
			if (text) options.filter = mergeFilters(options.filter, searchTextFilter(collection, text));
			if (filter) options.fields = mergeFilters(options.filter, filter);
			if (expand && expand.length > 0) options.expand = expand.join(',');

			const records = await pb.collection(collection).getFullList<R>(options);

			return records.map((item) => ({
				value: item,
				label: createRecordDisplay<R>(item, displayFields, displayFn),
				disabled: false
			}));
		};
	}

	//

	// function typeCaster(value: unknown): CollectionRecords[C] {
	// 	return value as CollectionRecords[C];
	// }
</script>

<Search
	searchFn={createSearchFunction(exclude, filter, expand)}
	{onSelect}
	{label}
	{placeholder}
	{disabled}
/>

<!-- <svelte:fragment slot="item" let:item>
		<slot name="item" item={typeCaster(item)}></slot>
</svelte:fragment> -->
