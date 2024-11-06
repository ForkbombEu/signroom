<script lang="ts">
	import type { SidebarButtonProps } from './types.js';
	import Button from '@/components/ui/button/button.svelte';
	import SidebarIcon from './sidebarIcon.svelte';
	import { Record } from 'effect';
	import type { ComponentProps } from 'svelte';
	import { cn } from '@/components/utils.js';

	type $$Props = ComponentProps<Button> & SidebarButtonProps & { isActive?: boolean };
	$: props = $$props as $$Props;

	$: classes = cn('flex w-full items-center !justify-between', {
		'pointer-events-none opacity-50': props.disabled
	});
</script>

<Button
	variant={props.isActive ? 'secondary' : 'ghost'}
	class={classes}
	on:click
	{...Record.remove($$restProps, 'text')}
	size="sm"
>
	<div class="flex items-center">
		<SidebarIcon {props} />
		<span>
			{props.text}
		</span>
	</div>
	<slot name="right" />
</Button>
