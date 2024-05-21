<script lang="ts">
	import Drawer from '$lib/components/drawer.svelte';
	import { getUIShellContext } from './UiShell.svelte';

	const { isSidebarHidden } = getUIShellContext();

	export let placement: 'left' | 'right' = 'left';
	export let width = 'w-40';
	export let backdrop = true;
	export let closeOnClickOutside = true;
	export let darkMode = false;
</script>

<Drawer
	bind:hidden={$isSidebarHidden}
	{placement}
	{width}
	{backdrop}
	{closeOnClickOutside}
	{darkMode}
	hideTopbar
>
	<slot />
</Drawer>
