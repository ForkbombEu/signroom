<script lang="ts">
	import clsx from 'clsx';
	import { getUIShellContext } from './UiShell.svelte';
	import { slide } from 'svelte/transition';

	export let width = 'w-40';
	export let darkMode = false;

	const { isSidebarHidden } = getUIShellContext();

	$: classes = clsx('flex flex-col ', width, { dark: darkMode });
</script>

{#if !$isSidebarHidden}
	<div transition:slide={{ axis: 'x' }} class={classes}>
		<slot />
	</div>
{/if}
