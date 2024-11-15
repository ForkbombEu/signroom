<script lang="ts">
	import { m } from '@/i18n';
	import * as Avatar from '@/components/ui/avatar';
	import type { AvatarProps } from 'bits-ui';

	type $$Props = AvatarProps & { src?: string; alt?: string; fallback?: string };
	$: props = $$props as $$Props;
</script>

<Avatar.Root {...$$props}>
	{#if props.src}
		<Avatar.Image src={props.src} alt={props.alt ?? m.Avatar()} />
	{/if}
	{#if props.fallback}
		<Avatar.Fallback>{props.fallback}</Avatar.Fallback>
	{/if}
</Avatar.Root>
