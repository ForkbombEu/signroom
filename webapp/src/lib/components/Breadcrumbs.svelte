<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts" context="module">
	import type { CalcBreadcrumbsOptions } from './Breadcrumbs';
	export { type CalcBreadcrumbsOptions as BreadcrumbsOptions };
</script>

<script lang="ts">
	import { Breadcrumb as BreadcrumbComponent, BreadcrumbItem } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { calcBreadcrumbs } from './Breadcrumbs';
	import type { Link } from '$lib/utils/types';

	//

	// export let items: Link[] = [];
	// export let homeIcon: any = undefined;
	export let options: Partial<CalcBreadcrumbsOptions> = {};

	//

	let breadcrumbs: Link[] = [];
	$: calcBreadcrumbs($page, options).then((newBreadcrumbs) => (breadcrumbs = newBreadcrumbs));
</script>

<BreadcrumbComponent aria-label="breadcrumb">
	{#each breadcrumbs as { href, text }, i}
		{@const isHomeBreadcrumb = i == 0}
		<BreadcrumbItem home={isHomeBreadcrumb} {href}>{text}</BreadcrumbItem>
	{/each}
</BreadcrumbComponent>
