<script lang="ts">
	import SectionTitle from '@/components/custom/sectionTitle.svelte';
	import RecordCreate from './record-actions/recordCreate.svelte';
	import { getCollectionManagerContext } from './collectionManagerContext';

	export let title: string | undefined = undefined;
	export let hideCreate = false;

	const { collection } = getCollectionManagerContext();
</script>

<SectionTitle title={title ?? collection}>
	<svelte:fragment slot="right">
		{#if !hideCreate}
			<RecordCreate />
		{/if}
	</svelte:fragment>
</SectionTitle>
