<script lang="ts">
	import Icon from '$lib/components/icon.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { Button, Hr } from 'flowbite-svelte';
	import { ArrowLeft } from 'svelte-heros-v2';

	export let data;
	let { content } = data;
</script>

<div class="mx-auto max-w-4xl p-4">
	{#if $currentUser}
		<Button
			outline
			on:click={() => {
				history.back();
			}}
		>
			<Icon src={ArrowLeft} mr />
			Back to dashboard
		</Button>

		<Hr hrClass="mt-4 mb-8" />
	{/if}

	{#if content}
		{@html content.pricing_content}
	{/if}
</div>
