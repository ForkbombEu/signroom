<script lang="ts">
	import * as Sheet from '@/components/ui/sheet';
	import type { ComponentProps } from 'svelte';
	import { cn } from '../utils';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';

	//

	type SheetSide = ComponentProps<Sheet.Content>['side'];

	export let side: SheetSide = 'right';

	export let title: string | undefined = undefined;

	let isOpen: boolean;
	export { isOpen as open };

	let className = '';
	export { className as class };

	export let contentClass = '';

	//

	function close() {
		isOpen = false;
	}

	function open() {
		isOpen = true;
	}
</script>

<Sheet.Root bind:open={isOpen} portal="body">
	<Sheet.Trigger asChild let:builder>
		<slot name="trigger" {builder} {open}>
			<Button builders={[builder]} class="shrink-0" variant="outline">
				<slot></slot>
			</Button>
		</slot>
	</Sheet.Trigger>

	<Sheet.Content
		side="right"
		class="flex {cn({ '!min-w-[300px] !max-w-none': side == 'right' })} flex-col px-0 {className}"
	>
		{#if title}
			<Sheet.Header class="px-6">
				<Sheet.Title>{title}</Sheet.Title>
				<Separator></Separator>
			</Sheet.Header>
		{/if}

		<div class="overflow-y-auto overflow-x-visible px-6 {contentClass}">
			<slot name="content" {close} />
		</div>
	</Sheet.Content>
</Sheet.Root>
