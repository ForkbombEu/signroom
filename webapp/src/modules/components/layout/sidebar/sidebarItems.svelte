<script lang="ts">
	import SidebarGroup from './sidebarGroup.svelte';
	import SidebarLink from './sidebarLink.svelte';
	import type { SidebarItemProps } from './types';

	export let links: SidebarItemProps[];
</script>

{#each links as link}
	{#if 'links' in link}
		<SidebarGroup {...link} />
	{:else}
		<SidebarLink {...link} />
	{/if}
{/each}
