<script lang="ts" context="module">
	import clsx from 'clsx';
	import type { NavigationTabProps as NavigationTab } from './navigationTab.svelte';
	export { NavigationTab };
</script>

<script lang="ts">
	import NavigationTabComponent from './navigationTab.svelte';

	export let tabs: NavigationTab[] = [];
	export let overflow: 'wrap' | 'scroll' = 'scroll';

	$: classes = clsx('flex gap-1', {
		'overflow-x-auto': overflow == 'scroll',
		'flex-wrap': overflow == 'wrap'
	});
</script>

<ul class={classes}>
	{#each tabs as tab}
		<li role="presentation">
			<NavigationTabComponent props={tab} />
		</li>
	{/each}
</ul>
