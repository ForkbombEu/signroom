<script lang="ts">
	import { Root, Content, Header, Footer } from '@/components/ui/card';
	import type { ComponentProps } from 'svelte';

	type $$Props = ComponentProps<Root> & { contentClass?: string };
	export let contentClass: $$Props['contentClass'] = '';
</script>

<Root {...$$props}>
	{#if $$slots.header}
		<Header>
			<slot name="header" />
		</Header>
	{/if}

	<Content class={contentClass}>
		<slot />
	</Content>

	{#if $$slots.footer}
		<Footer>
			<slot name="footer"></slot>
		</Footer>
	{/if}
</Root>
