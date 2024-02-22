<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';
	import { CreateRecord } from './recordActions';
	import { Document } from 'svelte-heros-v2';
	import type { IconComponent } from '$lib/utils/types';

	export let title = 'No records here!';
	export let description = 'Start by adding a record to this collection.';
	export let icon: IconComponent = Document;
	export let hideCreateButton: boolean = false;
</script>

<div class="w-full p-10 text-center border-2 rounded-lg">
	<div class="flex flex-col items-center justify-center space-y-6">
		<div class="shrink-0 rounded-full flex items-center justify-center text-gray-200">
			<svelte:component this={icon} size="160px" />
		</div>
		<div class="flex flex-col items-center justify-center">
			<Heading tag="h4" color="text-gray-400">{title}</Heading>
			<P class="w-fit text-gray-400 font-medium">{description}</P>
		</div>
		{#if !hideCreateButton}
			<CreateRecord />
		{/if}
	</div>
</div>
