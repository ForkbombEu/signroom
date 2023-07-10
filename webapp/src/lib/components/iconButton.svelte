<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import type { SizeType } from 'flowbite-svelte/dist/types';
	import type { SvelteComponent } from 'svelte';
	import { XMark } from 'svelte-heros-v2';

	export let icon: typeof SvelteComponent = XMark;
	export let border = false;

	const sizes = {
		xs: {
			iconSize: 20,
			padding: '!p-1'
		}
	};

	const props = sizes['xs'];
</script>

<Button
	class={`${props.padding} ${!border ? '!border-transparent' : ''}`}
	color="alternative"
	on:click
>
	<svelte:component this={icon} size={props.iconSize.toString()} />
</Button>
