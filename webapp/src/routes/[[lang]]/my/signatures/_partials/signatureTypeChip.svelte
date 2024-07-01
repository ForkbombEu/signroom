<script lang="ts">
	import type { SignaturesTypeOptions } from '$lib/pocketbase/types';
	import { Badge } from 'flowbite-svelte';
	import type { ComponentProps } from 'svelte';

	type BadgeColor = ComponentProps<Badge>['color'];

	export let type: SignaturesTypeOptions;

	const colors: Record<SignaturesTypeOptions, BadgeColor> = {
		cades: 'yellow',
		jades: 'green',
		pades: 'pink',
		xades: 'purple'
	};
</script>

<Badge class="capitalize" color={colors[type]}>
	{type}
</Badge>
