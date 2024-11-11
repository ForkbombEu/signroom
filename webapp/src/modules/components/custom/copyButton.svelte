<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { ClipboardPlus } from 'lucide-svelte';
	import Icon from '@/components/custom/icon.svelte';
	import type { ComponentProps } from 'svelte';
	import { m } from '@/i18n';

	//

	type $$Props = ComponentProps<Button> & {
		delay?: number;
		textToCopy: string;
	};

	export let textToCopy: $$Props['textToCopy'];
	export let delay: $$Props['delay'] = 2000;

	let isCopied = false;

	function copyText() {
		navigator.clipboard.writeText(textToCopy);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, delay);
	}
</script>

<Button variant="outline" on:click={copyText} {...$$restProps}>
	{#if !isCopied}
		<slot />
		<Icon src={ClipboardPlus} ml={Boolean($$slots.default)} />
	{:else}
		<span class="whitespace-nowrap">✅ {m.Copied()}</span>
	{/if}
</Button>
