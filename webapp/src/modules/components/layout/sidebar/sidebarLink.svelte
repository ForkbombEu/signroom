<script lang="ts">
	import { page } from '$app/stores';
	import Badge from '@/components/ui/badge/badge.svelte';
	import type { SidebarLinkProps } from './types.ts';
	import { isLinkActive } from '@/utils/other.js';
	import SidebarButton from './sidebarButton.svelte';

	type $$Props = SidebarLinkProps;
	$: props = $$props as $$Props;

	$: isActive = isLinkActive(props.href, $page);
</script>

<SidebarButton {...props} {isActive}>
	<svelte:fragment slot="right">
		{#if props.badge}
			<Badge>{props.badge}</Badge>
		{/if}
	</svelte:fragment>
</SidebarButton>
