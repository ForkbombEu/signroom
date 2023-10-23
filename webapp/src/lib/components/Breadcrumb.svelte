<script lang="ts">
	import type { Link } from '$lib/utils/types';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	export let items: Link[] = [];
	export let homeIcon: any = undefined;
</script>

<Breadcrumb aria-label="breadcrumb">
	{#each items as item, i}
		{#if homeIcon && i == 0}
			<BreadcrumbItem href="/my/organizations" home>
				<svelte:fragment slot="icon">
					<svelte:component this={homeIcon} class="w-5 h-5 mr-2" />
				</svelte:fragment>
				Organizations</BreadcrumbItem
			>
		{:else}
			<BreadcrumbItem href={item.href}>{item.text}</BreadcrumbItem>
		{/if}
	{/each}
</Breadcrumb>
