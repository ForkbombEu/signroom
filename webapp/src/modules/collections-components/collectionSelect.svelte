<script lang="ts" generics="C extends CollectionName, Expand extends ExpandQueryOption<C> = never">
	import {
		type PocketbaseQueryOptions,
		type ExpandQueryOption,
		PocketbaseQuery,
		type QueryResponse
	} from '@/pocketbase/query';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import type { ControlAttrs } from 'formsnap';
	import { setupComponentPbSubscriptions } from '@/pocketbase';
	import type { CollectionRecords } from '@/pocketbase/types';
	import { createRecordDisplay, type RecordPresenter } from './utils';
	import SelectInput, { type Selected } from '@/components/custom/selectInput.svelte';

	//

	// TODO - support two-way binding

	export let collection: C;
	export let queryOptions: Partial<PocketbaseQueryOptions<C, Expand>> = {};

	export let disabled = false;
	export let placeholder: string | undefined = undefined;
	export let clearValueOnSelect = false;

	export let onSelect: (record: QueryResponse<C, Expand> | undefined) => void = () => {};

	export let displayFields: (keyof CollectionRecords[C])[] | undefined = undefined;
	export let displayFn: RecordPresenter<QueryResponse<C, Expand>> | undefined = undefined;

	export let attrs: ControlAttrs | undefined = undefined;

	//

	$: pocketbaseQuery = new PocketbaseQuery(collection, queryOptions);

	let selectOptions: Selected<QueryResponse<C, Expand>>[] = [];
	$: loadRecords(pocketbaseQuery);

	async function loadRecords(pocketbaseQuery: PocketbaseQuery<C, Expand>) {
		const records = await pocketbaseQuery.getFullList();
		selectOptions = records.map((item) => ({
			value: item,
			label: createRecordDisplay(item, displayFields, displayFn)
		}));
	}

	//

	const subscriptionCollections: CollectionName[] = [collection, 'authorizations'];
	for (const c of subscriptionCollections) {
		setupComponentPbSubscriptions(c, () => loadRecords(pocketbaseQuery));
	}

	//

	let selected: Selected<QueryResponse<C, Expand>> | undefined = undefined;
	$: {
		onSelect(selected?.value);
		if (clearValueOnSelect) selected = undefined;
	}
</script>

<SelectInput {placeholder} {disabled} items={selectOptions} bind:selected {attrs} />
