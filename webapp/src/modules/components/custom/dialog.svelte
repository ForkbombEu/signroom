<script lang="ts">
	import * as Dialog from '@/components/ui/dialog/index.js';
	import { Footer } from '@/components/ui/dialog';
	import type { DialogProps } from 'bits-ui';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { omit } from 'lodash';

	//

	type $$Props = DialogProps & {
		title?: string;
		description?: string;
		open?: boolean;
		class?: string;
		contentClass?: string;
	};
	$: props = $$props as $$Props;

	export let open: $$Props['open'] = false;
	export let contentClass = '';
</script>

<Dialog.Root bind:open {...omit($$restProps, 'title')} portal="body">
	<Dialog.Trigger asChild let:builder>
		<slot
			name="trigger"
			{builder}
			openDialog={() => {
				open = true;
			}}
		/>
	</Dialog.Trigger>

	<Dialog.Content class={contentClass}>
		{#if props.title || props.description}
			<Dialog.Header class="!text-left">
				{#if props.title}
					<Dialog.Title>{props.title}</Dialog.Title>
				{/if}
				{#if props.description}
					<Dialog.Description>
						{props.description}
					</Dialog.Description>
				{/if}
			</Dialog.Header>
			<Separator></Separator>
		{/if}

		<slot name="content" {Footer} closeDialog={() => (open = false)} />
	</Dialog.Content>
</Dialog.Root>
