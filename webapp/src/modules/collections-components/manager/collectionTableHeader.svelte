<!-- <script lang="ts">
	import { getCollectionManagerContext } from '../collectionManagerContext';

	export let field: string;

	const { dataManager } = getCollectionManagerContext();
	const { queryParams } = dataManager;

	let isSort = false;
	let isSortDesc = false;
	let sortArrow = '';

	$: if ($queryParams.sort) {
		isSort = new RegExp(`\\b${field}\\b`).test($queryParams.sort);
		isSortDesc = $queryParams.sort.charAt(0) === '-';
		sortArrow = isSortDesc ? '▼' : '▲';
	}

	function handleClick() {
		$queryParams.sort = isSortDesc ? field : `-${field}`;
	}
</script> -->

<!-- <TableHeadCell>
	<div role="columnheader" tabindex="0" on:click={handleClick} class="cursor-pointer select-none">
		<span>{field}</span>
		{#if isSort}
			<span>{sortArrow}</span>
		{/if}
	</div>
</TableHeadCell> -->
