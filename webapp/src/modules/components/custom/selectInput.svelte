<script lang="ts" context="module">
	export type Selected<T> = {
		label?: string;
		value: T;
	};
</script>

<script lang="ts" generics="T, Multiple extends boolean = false">
	import { maybeArrayIsValue } from '@/utils/other';

	import { m } from '@/i18n';
	import { omit } from 'lodash/fp';

	import * as Select from '@/components/ui/select';
	import type { SelectProps } from 'bits-ui';
	import type { ControlAttrs } from 'formsnap';

	//

	type $$Props = SelectProps<T, Multiple> & { placeholder?: string; attrs?: ControlAttrs };
	$: props = $$props as $$Props;

	export let selected: $$Props['selected'] = undefined;
</script>

<Select.Root {...omit(['attrs', 'placeholder', 'label'], $$restProps)} bind:selected>
	<!-- <Select.Root {...$$restProps} bind:selected> -->
	<!-- Reference: https://formsnap.dev/docs/recipes/bits-ui-select -->
	{#if selected}
		{#if Array.isArray(selected)}
			{#each selected as item}
				<input name={props.attrs?.name} hidden value={item} />
			{/each}
		{:else}
			<input name={props.attrs?.name} hidden value={props.selected} />
		{/if}
	{/if}

	<Select.Trigger {...props.attrs}>
		{#if maybeArrayIsValue(selected)}
			<Select.Value />
		{:else}
			<span data-placeholder>{props.placeholder ?? m.Select_a_value()}</span>
		{/if}
	</Select.Trigger>

	<Select.Content sideOffset={0} class="!mt-0">
		{#if props.items?.length}
			{#each props.items as { label, value }}
				<Select.Item {label} {value}>{label}</Select.Item>
			{/each}
		{:else}
			<Select.Item class="flex justify-center [&>span]:hidden" disabled value={undefined}>
				{m.No_options_available()}
			</Select.Item>
		{/if}
	</Select.Content>
</Select.Root>
