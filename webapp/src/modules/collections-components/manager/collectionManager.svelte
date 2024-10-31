<script
	lang="ts"
	generics="C extends CollectionName, Expand extends ExpandProp<C> = never, InverseExpand extends InverseExpandProp = never"
>
	import type { CollectionRecords, RecordIdString } from '@/pocketbase/types';

	import { ensureArray } from '@/utils/other';
	import { FolderIcon } from 'lucide-svelte';
	import MessageCircleWarning from 'lucide-svelte/icons/message-circle-warning';
	import { m } from '@/i18n';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { pb, setupComponentPbSubscriptions } from '@/pocketbase';
	import { ClientResponseError } from 'pocketbase';
	import EmptyState from '@/components/custom/emptyState.svelte';
	import { Array as A } from 'effect';
	import CollectionManagerPagination from './collectionManagerPagination.svelte';

	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { ExpandProp, InverseExpandProp } from '../types';
	import type { SimplifyDeep } from 'type-fest/source/simplify-deep';
	import type { RecordFullListOptions, RecordListOptions } from 'pocketbase';
	import type { ExpandableResponse } from '../types';
	import {
		COLLECTION_MANAGER_KEY,
		type CollectionManagerContext,
		type FetchOptions
	} from './collectionManagerContext';
	import type { UIOptions as CollectionFormUIOptions, FieldsOptions } from '../form/formOptions';
	import type { FormOptions as SuperformsOptions } from '@/forms';

	//

	export let collection: C;

	export let hide: ('emptyState' | 'pagination')[] = [];
	export let fetchOptions: Partial<FetchOptions<C, Expand, InverseExpand>> = {};

	//

	export let formUIOptions: CollectionFormUIOptions = {};
	export let createFormUIOptions: CollectionFormUIOptions = {};
	export let editFormUIOptions: CollectionFormUIOptions = {};

	export let formSuperformsOptions: SuperformsOptions<CollectionRecords[C]> = {};
	export let createFormSuperformsOptions: SuperformsOptions<CollectionRecords[C]> = {};
	export let editFormSuperformsOptions: SuperformsOptions<CollectionRecords[C]> = {};

	export let formFieldsOptions: Partial<FieldsOptions<C>> = {};
	export let createFormFieldsOptions: Partial<FieldsOptions<C>> = {};
	export let editFormFieldsOptions: Partial<FieldsOptions<C>> = {};

	//

	const fetchOptionsStore = writable<typeof fetchOptions>(fetchOptions);
	$: $fetchOptionsStore = { ...$fetchOptionsStore, ...fetchOptions };

	const currentPage = writable<number | undefined>(undefined);
	const totalItems = writable<number | undefined>(undefined);

	let records: T[] = [];
	type T = SimplifyDeep<ExpandableResponse<C, Expand, InverseExpand>>;

	let error: ClientResponseError | undefined = undefined;

	let recordService = pb.collection(collection);

	$: loadRecords($fetchOptionsStore, $currentPage);

	async function loadRecords(
		fetchOptions: Partial<FetchOptions<C, Expand, InverseExpand>> = {},
		currentPage: number | undefined = undefined
	) {
		const { expand, filter, inverseExpand, sort, perPage } = fetchOptions;
		const options: RecordFullListOptions | RecordListOptions = {
			requestKey: null
		};
		if (filter) options.filter = filter;
		if (expand) options.expand = expand.join(',');
		if (inverseExpand) {
			const expand = Object.entries(inverseExpand)
				.map(([k, v]) => `${k}_via_${v}`)
				.join(',');
			if (options.expand) options.expand = options.expand + ',' + expand;
			else options.expand = expand;
		}
		options.sort = sort ? sort : '-created';

		try {
			if (perPage) {
				const result = await recordService.getList<T>(currentPage, perPage, options);
				totalItems.set(result.totalItems);
				records = result.items;
			} else {
				records = await recordService.getFullList<T>(options);
			}
		} catch (e) {
			error = e as ClientResponseError;
		}
	}

	/* Subscriptions */

	// TODO - Use `expand` field instead of `subscribe`
	// TODO - When "authorizations" is added, `records` update, but not when it's removed
	const subscriptionCollections: CollectionName[] = [
		...ensureArray($fetchOptionsStore.subscribe),
		collection,
		'authorizations'
	];
	for (const c of A.dedupe(subscriptionCollections)) {
		setupComponentPbSubscriptions(c, () => loadRecords($fetchOptionsStore, $currentPage));
	}

	/* Record selection */

	const selectedRecords = writable<string[]>([]);

	function areAllRecordsSelected(selectedRecords: RecordIdString[]) {
		return records.every((r) => selectedRecords.includes(r.id));
	}

	function toggleSelectAllRecords() {
		const allSelected = areAllRecordsSelected($selectedRecords);
		if (allSelected) {
			$selectedRecords = [];
		} else {
			$selectedRecords = records.map((item) => item.id);
		}
	}

	function discardSelection() {
		$selectedRecords = [];
	}

	/* Context */

	setContext<CollectionManagerContext<C, Expand, InverseExpand>>(COLLECTION_MANAGER_KEY, {
		collection,
		recordService,
		paginationContext: {
			currentPage,
			totalItems
		},
		fetchOptions: fetchOptionsStore,
		selectionContext: {
			selectedRecords,
			areAllRecordsSelected,
			toggleSelectAllRecords,
			discardSelection
		},
		formsOptions: {
			base: {
				uiOptions: formUIOptions,
				superformsOptions: formSuperformsOptions,
				fieldsOptions: formFieldsOptions
			},
			create: {
				uiOptions: createFormUIOptions,
				superformsOptions: createFormSuperformsOptions,
				fieldsOptions: createFormFieldsOptions
			},
			edit: {
				uiOptions: editFormUIOptions,
				superformsOptions: editFormSuperformsOptions,
				fieldsOptions: editFormFieldsOptions
			}
		}
	});
</script>

<slot name="top" />

{#if error}
	<EmptyState
		title={m.Error()}
		description={m.Some_error_occurred_while_loading_records_()}
		icon={MessageCircleWarning}
	/>
{:else if records.length > 0}
	<slot {records} selectedRecords={$selectedRecords} Pagination={CollectionManagerPagination} />

	{#if !hide.includes('pagination')}
		<CollectionManagerPagination class="mt-6" />
	{/if}
{:else}
	<slot name="emptyState">
		{#if !hide.includes('emptyState')}
			<EmptyState
				title={m.No_items_here()}
				description={m.Start_by_adding_a_record_to_this_collection_()}
				icon={FolderIcon}
			/>
		{/if}
	</slot>
{/if}
