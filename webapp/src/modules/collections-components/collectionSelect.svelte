<script lang="ts" generics="C extends CollectionName, Expand extends ExpandProp<C> = never">
	import type { CollectionName } from '@/pocketbase/collections-models';
	import type { ControlAttrs } from 'formsnap';
	import type { ExpandableResponse, ExpandProp } from './types';
	import { onDestroy, onMount } from 'svelte';
	import { pb, setupComponentPbSubscriptions } from '@/pocketbase';
	import type { RecordFullListOptions } from 'pocketbase';
	import type { CollectionRecords, RecordIdString } from '@/pocketbase/types';
	import {
		createRecordDisplay,
		excludeIdsFilter,
		mergeFilters,
		type RecordPresenter
	} from './utils';
	import SelectInput, { type Selected } from '@/components/custom/selectInput.svelte';

	//

	// TODO - support two-way binding

	export let collection: C;
	export let expand: Expand | undefined = undefined;

	export let exclude: RecordIdString[] = [];
	export let disabled = false;
	export let filter: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	export let clearValueOnSelect = false;

	export let onSelect: (record: ExpandableResponse<C, Expand> | undefined) => void = () => {};

	export let displayFields: (keyof CollectionRecords[C])[] | undefined = undefined;
	export let displayFn: RecordPresenter<ExpandableResponse<C, Expand>> | undefined = undefined;

	export let attrs: ControlAttrs | undefined = undefined;

	//

	type R = ExpandableResponse<C, Expand>;

	let selectOptions: Selected<R>[] = [];

	async function loadRecords(
		exclude: RecordIdString[] = [],
		filter: string | undefined = undefined,
		expand: Expand = [] as unknown as Expand
	) {
		const options: RecordFullListOptions = {
			requestKey: null
		};
		if (exclude.length > 0) options.filter = excludeIdsFilter(exclude);
		if (filter) options.filter = mergeFilters(options.filter, filter);
		if (expand && expand.length) options.expand = expand.join(',');

		const records = await pb.collection(collection).getFullList<R>(options);

		selectOptions = records.map((item) => ({
			value: item,
			label: createRecordDisplay<R>(item, displayFields, displayFn)
		}));
	}

	//

	const subscriptionCollections: CollectionName[] = [collection, 'authorizations'];
	for (const c of subscriptionCollections) {
		setupComponentPbSubscriptions(c, () => loadRecords(exclude, filter, expand));
	}
	$: loadRecords(exclude, filter);

	//

	let selected: Selected<R> | undefined = undefined;
	$: {
		onSelect(selected?.value);
		if (clearValueOnSelect) selected = undefined;
	}
</script>

<SelectInput {placeholder} {disabled} items={selectOptions} bind:selected {attrs} />
