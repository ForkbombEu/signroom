<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { XMark } from 'svelte-heros-v2';
	import type { IconComponent } from '$lib/utils/types';

	export let icon: IconComponent = XMark;
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
