<script lang="ts">
	import { Heading, Hr, P } from 'flowbite-svelte';

	export let title: string;
	export let description: string | null = null;
	export let containerClass: string = '';
</script>

<div class={`flex w-full justify-between items-center ${containerClass}`}>
	<div>
		<Heading
			tag="h2"
			class="mb-4 text-2xl lg:text-3xl tracking-tight font-bold text-gray-900 dark:text-white"
			>{title}</Heading
		>
		{#if description}
			<Hr />
			<P class="text-slate-500 sm:text-lg dark:text-slate-400 !font-light mt-2">{description}</P>
		{/if}
	</div>
	<slot name="actions" />
</div>
