<script lang="ts" generics="T">
	import { DEFAULT_SORT_ORDER } from '@/pocketbase/query';
	import Icon from '@/components/custom/icon.svelte';
	import { Button } from '@/components/ui/button';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import { Head } from '@/components/ui/table';
	import type { KeyOf } from '@/utils/types';
	import { capitalize } from 'lodash';
	import { ArrowUp, ArrowDown } from 'lucide-svelte';

	export let field: KeyOf<T>;
	export let label: string | undefined = undefined;

	const { pocketbaseQuery } = getCollectionManagerContext();

	$: sortState = $pocketbaseQuery.sortOption;
	$: isSortField = sortState[0] == field;

	async function handleClick() {
		if (!isSortField) {
			$pocketbaseQuery.options.sort = [field, DEFAULT_SORT_ORDER];
		} else {
			$pocketbaseQuery.options.sort = $pocketbaseQuery.getFlippedSort();
		}
	}
</script>

<Head class="group">
	<div class="flex items-center gap-x-2">
		{label ?? capitalize(field)}
		<Button
			size="icon"
			variant="ghost"
			class="{isSortField ? 'visible' : 'invisible'} size-6 group-hover:visible"
			on:click={handleClick}
		>
			<Icon src={!isSortField ? ArrowUp : sortState[1] == 'DESC' ? ArrowDown : ArrowUp} size={14} />
		</Button>
	</div>
</Head>
