<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { ClipboardDocument } from 'svelte-heros-v2';

	export let imageSrc: string;
	export let delay = 2000;

	let isCopied = false;

	function copyImage() {
		const img = new Image();
		img.src = imageSrc;

		const responsePromise = fetch(img.src);
  try {
    if ('write' in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/svg+xml': new Promise(async (resolve) => {
            const blob = await responsePromise.then(response => response.blob());
            resolve(blob);
          }),
        }),
      ]);
      // Image copied as image.
    } else {
      const text = await responsePromise.then(response => response.text());
      await navigator.clipboard.writeText(text);
      // Image copied as source code.
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
});
		isCopied = true;

		setTimeout(() => {
			isCopied = false;
		}, delay);
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
