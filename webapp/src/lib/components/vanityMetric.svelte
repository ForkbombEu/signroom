<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';

	export let number: number;
	export let text: string;
</script>

<div
	class="flex flex-col items-center bg-primary-50 rounded-lg border-primary-300 border w-fit p-6"
>
	<Heading tag="h3" class="w-fit" color="text-primary-600">{number}</Heading>
	<P color="text-primary-600">{text}</P>
</div>
