<script lang="ts">
	import * as Alert from '@/components/ui/alert/index.js';
	import Icon from './icon.svelte';
	import type { ComponentProps } from 'svelte';
	import type { IconComponent } from '@/components/types';
	import { cn } from '../utils';

	type $$Props = ComponentProps<Alert.Root> & { icon?: IconComponent };
	$: props = $$props as $$Props;
</script>

<Alert.Root {...$$props} class="{$$props.class} {cn({ '!p-4': !Boolean($$props.icon) })}">
	{#if props.icon}
		<Icon src={props.icon} size={16}></Icon>
	{/if}

	<slot Title={Alert.Title} Description={Alert.Description} />
</Alert.Root>
