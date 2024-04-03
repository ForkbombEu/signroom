<script lang="ts" context="module">
	import type { CalcBreadcrumbsOptions } from './Breadcrumbs';
	export { CalcBreadcrumbsOptions as BreadcrumbsOptions };
</script>

<script lang="ts">
	import { Breadcrumb as BreadcrumbComponent, BreadcrumbItem } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { calcBreadcrumbs } from './Breadcrumbs';

	//

	// export let items: Link[] = [];
	// export let homeIcon: any = undefined;
	export let options: Partial<CalcBreadcrumbsOptions> = {};

	//

	$: breadcrumbsPromise = calcBreadcrumbs($page, options);
</script>

{#await breadcrumbsPromise then breadcrumbs}
	<BreadcrumbComponent aria-label="breadcrumb">
		{#each breadcrumbs as { href, text }, i}
			{@const isHomeBreadcrumb = i == 0}
			<BreadcrumbItem home={isHomeBreadcrumb} {href}>{text}</BreadcrumbItem>
		{/each}
	</BreadcrumbComponent>
{/await}
