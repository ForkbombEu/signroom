<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';

	export let number: number;
	export let text: string;
</script>

<div
	class="flex w-fit flex-col items-center rounded-lg border border-primary-300 bg-primary-50 p-6"
>
	<Heading tag="h3" class="w-fit" color="text-primary-600">{number}</Heading>
	<P color="text-primary-600">{text}</P>
</div>
