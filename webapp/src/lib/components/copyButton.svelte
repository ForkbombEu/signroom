<script lang="ts">
	import { Button } from 'flowbite-svelte';

	export let textToCopy: string;
	export let delay = 2000;

	let isCopied = false;

	function copyText() {
		navigator.clipboard.writeText(textToCopy);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, delay);
	}
</script>

<Button on:click={copyText} color="alternative">
	{#if !isCopied}
		<div class="w-4 mr-2">
			<svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
				<title>copy</title>
				<path
					d="M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z"
					transform="translate(0)"
				/>
				<path d="M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z" transform="translate(0)" />
				<rect
					id="_Transparent_Rectangle_"
					data-name="&lt;Transparent Rectangle&gt;"
					class="fill-none"
					width="32"
					height="32"
				/>
			</svg>
		</div>
		<slot />
	{:else}
		✅ Copied!
	{/if}
</Button>
