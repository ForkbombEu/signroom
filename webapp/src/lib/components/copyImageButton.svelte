<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { imageSrcToBlob } from '$lib/utils/clientFileDownload';
	import { Button } from 'flowbite-svelte';
	import { ClipboardDocument } from 'svelte-heros-v2';

	export let imageSrc: string;
	export let delay = 2000;

	let isCopied = false;

	async function copyImage() {
		try {
			const blob = imageSrcToBlob(imageSrc);

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

	const isCopyingSupported = Boolean(window.ClipboardItem);
</script>

{#if isCopyingSupported}
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
{/if}
