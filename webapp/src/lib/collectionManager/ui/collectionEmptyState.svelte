<script lang="ts">
	import { CreateRecord } from './recordActions';
	import { FolderOpen } from 'svelte-heros-v2';
	import type { IconComponent } from '$lib/utils/types';

	import EmptyState from '$lib/components/emptyState.svelte';

	export let title = 'No items here!';
	export let description = 'Start by adding a record to this collection.';
	export let icon: IconComponent = FolderOpen;
	export let hideCreateButton: boolean = false;
</script>

<EmptyState {icon} {title} {description}>
	<slot />
	<slot name="bottom" slot="bottom">
		{#if !hideCreateButton}
			<div class="mt-6">
				<CreateRecord />
			</div>
		{/if}
	</slot>
</EmptyState>
