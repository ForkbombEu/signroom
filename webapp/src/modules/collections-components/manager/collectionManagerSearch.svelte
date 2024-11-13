<script lang="ts">
	import IconButton from '@/components/custom/iconButton.svelte';
	import { getCollectionManagerContext } from './collectionManagerContext';
	import { Input } from '@/components/ui/input';
	import { m } from '@/i18n';

	const { pocketbaseQuery } = getCollectionManagerContext();

	function clearSearch() {
		$pocketbaseQuery.options.search = undefined;
	}
</script>

<div class="flex gap-2">
	<Input bind:value={$pocketbaseQuery.options.search} placeholder={m.Search()} />
	<IconButton on:click={clearSearch} />
</div>
