<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';
	import CreateRecord from '../recordActions/createRecord.svelte';
	import { Clock } from 'svelte-heros-v2';
	import type { SvelteComponent } from 'svelte';
	
	export let title: string;
	export let description: string;
	export let icon: typeof SvelteComponent = Clock;
</script>

<div class="w-full py-20 text-center border-2 rounded-lg">
	<div class="flex flex-col items-center justify-center space-y-6">
		<div class="shrink-0 rounded-full flex items-center justify-center text-gray-400">
			<svelte:component this={icon} class="w-48 h-48" />
		</div>
		<div class="flex flex-col items-center justify-center">
			<Heading tag="h3">{title}</Heading>
			<P class="w-fit text-gray-400 font-semibold">{description}</P>
		</div>
		<CreateRecord />
	</div>
</div>
