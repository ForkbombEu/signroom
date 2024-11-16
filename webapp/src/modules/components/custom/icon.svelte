<script lang="ts">
	import type { IconComponent } from '@/components/types';
	import clsx from 'clsx';
	import type { IconProps } from 'lucide-svelte';

	type $$Props = IconProps & { src: IconComponent; ml?: boolean; mr?: boolean };

	export let src: $$Props['src'];
	export let size: $$Props['size'] = 16;

	$: classes = clsx($$props, {
		'mr-2': $$props.mr,
		'ml-2': $$props.ml
	});
</script>

<svelte:component this={src} {size} {...$$restProps} class="${$$props.class} ${classes}" />
