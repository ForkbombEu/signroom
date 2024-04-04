<script lang="ts" context="module">
	export type NavigationTabProps = {
		label: string;
		href: string;
		icon?: IconComponent;
		activeForSubpages?: boolean;
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import type { IconComponent } from '$lib/utils/types';
	import type { Page } from '@sveltejs/kit';
	import clsx from 'clsx';
	import { resolveRoute } from '$lib/i18n';

	export let props: NavigationTabProps;
	let { href, icon, label, activeForSubpages = true } = props;

	//

	$: isActive = isTabActive(href, $page);

	function isTabActive(href: string, page: Page) {
		const isExact = page.url.pathname == resolveRoute(href, page.url);
		const isNested = page.url.pathname.includes(href);
		return activeForSubpages ? isNested : isExact;
	}

	//

	$: classes = clsx(
		'inline-block text-sm font-medium text-center p-4 border-b-2 flex whitespace-nowrap',
		{
			'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400':
				!isActive,
			'text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500 active':
				isActive
		}
	);
</script>

<a role="tab" class={classes} {href}>
	{#if icon}
		<div class="mr-2">
			<svelte:component this={icon} size="20"></svelte:component>
		</div>
	{/if}
	{label}
</a>
