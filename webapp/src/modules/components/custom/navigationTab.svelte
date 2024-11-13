<script lang="ts" context="module">
	export interface NavigationTabProps extends LinkWithIcon {
		activeForSubpages?: boolean;
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import type { LinkWithIcon } from '@/components/types';
	import { isLinkActive } from '@/utils/other';
	import Icon from '@/components/custom/icon.svelte';
	import { cn } from '@/components/utils';

	export let props: NavigationTabProps;
	let { href, icon, text, activeForSubpages = true } = props;

	//

	$: isActive = isLinkActive(href, $page, activeForSubpages);

	$: classes = cn(
		'inline-block text-sm font-medium text-center p-4 py-3 border-b-2 flex items-center whitespace-nowrap',
		{
			'border-transparent hover:border-primary/20': !isActive,
			'text-primary border-primary border-b-2': isActive
		}
	);
</script>

<a role="tab" class={classes} {href}>
	{#if icon}
		<Icon src={icon} mr></Icon>
	{/if}
	{text}
</a>
