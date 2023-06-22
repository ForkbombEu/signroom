<script lang="ts" context="module">
	import type { Record } from 'pocketbase';
	import { getContext, setContext } from 'svelte';
	import type { Collections } from '$lib/pocketbase-types';

	//

	export const FORM_KEY = Symbol('tableRow');

	export type RowContext = {
		collection: Collections | string;
		record: Record;
	};

	export function getRowContext(): RowContext {
		return getContext(FORM_KEY);
	}
</script>

<script lang="ts">
	import { TableBodyRow } from 'flowbite-svelte';

	export let collection: Collections | string;
	export let record: Record;

	setContext(FORM_KEY, { collection, record });
</script>

<TableBodyRow>
	<slot />
</TableBodyRow>
