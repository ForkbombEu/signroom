<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { ClipboardDocument } from 'svelte-heros-v2';

	export let imageSrc: string;
	export let delay = 2000;

	let isCopied = false;

	async function copyImage() {
		const img = new Image();
		img.src = imageSrc;

		const responsePromise = await fetch(img.src);
		const blob = await responsePromise.blob();
		console.log(blob, responsePromise)
		try {
			await navigator.clipboard.write([
				new ClipboardItem({
					'image/png': blob
				})
			]);
			isCopied = true;

			setTimeout(() => {
				isCopied = false;
			}, delay);
		} catch (err) {
			console.error(err);
		}
	}
</script>

<Button on:click={copyImage} color="alternative">
	{#if !isCopied}
		<ClipboardDocument size="20" />
		<span class="ml-2">
			<slot />
		</span>
	{:else}
		<span class="whitespace-nowrap">✅ Copied!</span>
	{/if}
</Button>
