<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	export let items: { label: string; href: string }[] = [];
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
		{/if}
		<BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>
	{/each}
</Breadcrumb>
