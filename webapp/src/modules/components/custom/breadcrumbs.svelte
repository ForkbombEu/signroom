<script lang="ts" context="module">
	import type { CalcBreadcrumbsOptions } from './breadcrumbs';
	export { type CalcBreadcrumbsOptions as BreadcrumbsOptions };
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { calcBreadcrumbs } from './breadcrumbs';
	import type { Link } from '@/components/types';
	import * as Breadcrumb from '@/components/ui/breadcrumb/index.js';
	import Icon from './icon.svelte';
	import { Home } from 'lucide-svelte';

	//

	// export let items: Link[] = [];
	// export let homeIcon: any = undefined;
	export let options: Partial<CalcBreadcrumbsOptions> = {};

	//

	let breadcrumbs: Link[] = [];
	$: calcBreadcrumbs($page, options).then((newBreadcrumbs) => (breadcrumbs = newBreadcrumbs));
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		{#each breadcrumbs as { href, text }, i}
			{@const isHome = i == 0}
			{@const isLast = i == breadcrumbs.length - 1}

			{#if !isHome}
				<Breadcrumb.Item>
					<Breadcrumb.Link {href}>{text}</Breadcrumb.Link>
				</Breadcrumb.Item>
			{:else}
				<Breadcrumb.Item>
					<Breadcrumb.Link {href}><Icon src={Home} /></Breadcrumb.Link>
				</Breadcrumb.Item>
			{/if}

			<!-- {#if isLast}
			<Breadcrumb.Item>
			<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
			</Breadcrumb.Item>
			{/if} -->

			{#if !isLast}
				<Breadcrumb.Separator />
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
