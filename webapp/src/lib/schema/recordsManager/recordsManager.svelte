<script lang="ts" context="module">
	import type { Record as PBRecord, RecordService } from 'pocketbase';
	import { getContext, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { FormSettings } from '../CRUDForm.svelte';

	//

	export const RECORDS_MANAGER_KEY = Symbol('rmk');

	export type RecordsManagerContext = {
		collection: string;
		dataManager: {
			recordService: RecordService;
			loadRecords: () => Promise<void>;
			queryParams: Writable<RecordFullListQueryParams>;
		};
		selectionManager: {
			selectedRecords: Writable<string[]>;
			allRecordsSelected: (selectedRecords: string[]) => boolean;
			toggleSelectAllRecords: () => void;
			discardSelection: () => void;
		};
		formSettings: Partial<FormSettings>;
		editFormSettings: Partial<FormSettings>;
	};

	export function getRecordsManagerContext(): RecordsManagerContext {
		return getContext(RECORDS_MANAGER_KEY);
	}

	//

	type SlotTypeCaster<RecordGeneric> = RecordGeneric[];
	export function createSlotTypeCaster<RecordGeneric>(): SlotTypeCaster<RecordGeneric> {
		return [];
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	import { pb } from '$lib/pocketbase';
	import type { RecordFullListQueryParams } from 'pocketbase';
	import type { Collections } from '$lib/pocketbase-types';
	import { writable } from 'svelte/store';
	import { PaginationItem, Pagination } from 'flowbite-svelte';
	import GridSpinner from '$lib/components/gridSpinner.svelte';


	//

	export let collection: Collections | string;
	export let formSettings: Partial<FormSettings> = {};
	export let editFormSettings: Partial<FormSettings> = {};
	export let initialQueryParams: RecordFullListQueryParams = {};
	export let subscribe: string[] = [];

	/* Slot typing */

	type RecordGeneric = $$Generic;
	export let slotTypeCaster = createSlotTypeCaster<RecordGeneric>();
	slotTypeCaster; // avoid 'unused' warning

	/* Data load */
	$: pages = Array.from({ length: totalPages }, (_, i) => ({
		name: `${i + 1}`,
		href: `?page=${i + 1}`
	}));
	let currentPage = '';
	let totalItems = 0;
	$: currentPage = $page.url.searchParams.get('page') || '1';
	export let perPage = 5;

	const queryParams = writable<RecordFullListQueryParams>({
		sort: '-created',
		...initialQueryParams
	});

	$: $queryParams = {
		$autoCancel: false,
		...$queryParams,
		...initialQueryParams
	};

	const recordService = pb.collection(collection);

	let records: PBRecord[] = [];
	let totalPages: number = 0;

	async function loadRecords() {
		const res = await recordService.getList(Number(currentPage), perPage, { ...$queryParams });
		records = res.items;
		totalPages = res.totalPages;
		totalItems = res.totalItems;
	}

	let promise = loadRecords();

	$: if (browser) {
		$queryParams;
		initialQueryParams;
		currentPage;
		totalPages;
		totalItems;
		loadRecords();
	}

	onMount(() => {
		const collections = [...subscribe, collection];
		for (const c of collections) {
			pb.collection(c).subscribe('*', () => {
				loadRecords();
			});
		}

		return () => {
			for (const c of collections) {
				pb.collection(c).unsubscribe();
			}
		};
	});

	/* Record selection */

	const selectedRecords = writable<string[]>([]);

	function allRecordsSelected(selectedRecords: string[] = []) {
		return records.every((r) => selectedRecords.includes(r.id));
	}

	function toggleSelectAllRecords() {
		const allSelected = allRecordsSelected($selectedRecords);
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

	setContext<RecordsManagerContext>(RECORDS_MANAGER_KEY, {
		collection,
		dataManager: {
			recordService,
			loadRecords,
			queryParams
		},
		selectionManager: {
			selectedRecords,
			allRecordsSelected,
			toggleSelectAllRecords,
			discardSelection
		},
		formSettings,
		editFormSettings
	});
</script>

{#await promise}
	<div class="flex items-center justify-center min-h-screen justify-items-center">
		<GridSpinner />
	</div>
{:then}
	<slot {records} {loadRecords} />
	<slot name="pagination" {totalItems} {totalPages} {currentPage} {perPage}>
		{#if totalPages > 1}
			<div class="flex flex-col items-center justify-center gap-2 my-5">
				<div class="text-sm text-gray-700 dark:text-gray-400">
					Showing <span class="font-semibold text-gray-900 dark:text-white"
						>{perPage * Number(currentPage) - perPage + 1}</span
					>
					to
					<span class="font-semibold text-gray-900 dark:text-white"
						>{Number(currentPage) == totalPages ? totalItems : perPage * Number(currentPage)}</span
					>
					of <span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span> Entries
				</div>

				<div class="flex w-full justify-center">
					<Pagination
						{pages}
						activeClass="bg-blue-500 text-white"
						on:previous={(e) => {
							e.preventDefault();
							if (Number(currentPage) - 1 < 1) return;
							goto(`?page=${Number(currentPage) - 1}`);
						}}
						on:next={(e) => {
							e.preventDefault();
							if (Number(currentPage) + 1 > totalPages) return;
							goto(`?page=${Number(currentPage) + 1}`);
						}}
						on:click={(e) => {
							e.preventDefault();
							goto(e.target?.href);
						}}
					/>
				</div>
			</div>
		{/if}
	</slot>
{:catch}
	<div class="flex items-center justify-center min-h-screen justify-items-center">
		Some error occured
	</div>
{/await}
