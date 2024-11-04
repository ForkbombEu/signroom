<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { IconComponent } from '../types';
	import type { ButtonEvents, ButtonProps } from '../ui/button';
	import Button from '../ui/button/button.svelte';
	import Icon from './icon.svelte';
	import { Record } from 'effect';

	type ButtonSize = 'md' | 'sm' | 'lg';

	type $$Props = ButtonProps & { icon?: IconComponent; size?: ButtonSize };
	type $$Events = ButtonEvents;

	export let icon: $$Props['icon'] = X;
	export let size: ButtonSize = 'md';

	//

	type ButtonConfig = {
		iconSize: number;
		sizeClass: string;
	};

	const sizes: Record<ButtonSize, ButtonConfig> = {
		sm: {
			iconSize: 16,
			sizeClass: 'size-8'
		},
		md: {
			iconSize: 16,
			sizeClass: 'size-10'
		},
		lg: {
			iconSize: 18,
			sizeClass: 'size-12'
		}
	};
</script>

<Button
	variant="outline"
	{...$$restProps}
	size="icon"
	class="{sizes[size ?? 'md'].sizeClass} {$$restProps.class}"
>
	<Icon src={icon ?? X} size={sizes[size ?? 'md'].iconSize} />
</Button>
