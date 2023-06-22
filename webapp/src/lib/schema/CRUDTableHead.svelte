<script lang="ts">
	import { TableHeadCell } from 'flowbite-svelte';
	import type { RecordFullListQueryParams } from 'pocketbase';

	export let field: string;
	export let queryParams: RecordFullListQueryParams;

	let isSort = false;
	let isSortDesc = false;
	let sortArrow = '';

	$: if (queryParams.sort) {
		isSort = new RegExp(`\\b${field}\\b`).test(queryParams.sort);
		isSortDesc = queryParams.sort.charAt(0) === '-';
		sortArrow = isSortDesc ? '▼' : '▲';
	}

	function handleClick() {
		queryParams.sort = isSortDesc ? field : `-${field}`;
	}
</script>

<TableHeadCell>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click={handleClick} class="select-none cursor-pointer">
		<span>{field}</span>
		{#if isSort}
			<span>{sortArrow}</span>
		{/if}
	</div>
</TableHeadCell>
