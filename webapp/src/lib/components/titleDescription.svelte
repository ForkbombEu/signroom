<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';

	export let title: string;
	export let description: string | null = null;
</script>

<div class="flex w-full justify-between items-center">
	<div>
		<Heading tag="h2">{title}</Heading>
		{#if description}
			<P class="text-slate-600 pt-6">{description}</P>
		{/if}
	</div>
	<slot name="actions" />
</div>
