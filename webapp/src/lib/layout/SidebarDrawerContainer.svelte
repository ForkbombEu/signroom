<script lang="ts">
	import { Drawer } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { getUIShellContext } from './UIShell.svelte';

	const { isSidebarHidden } = getUIShellContext();

	export let placement: 'left' | 'right' = 'left';
	export let width = 'w-40';
	export let backdrop = true;
	export let closeOnClickOutside = true;

	let transitionParams = {
		x: placement == 'right' ? 320 : -320,
		duration: 200,
		easing: sineIn
	};
</script>

<Drawer
	transitionType="fly"
	{backdrop}
	{transitionParams}
	bind:hidden={$isSidebarHidden}
	activateClickOutside={closeOnClickOutside}
	{placement}
	class={`flex flex-col !p-0`}
	{width}
>
	<slot />
</Drawer>
