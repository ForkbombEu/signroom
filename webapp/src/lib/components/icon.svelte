<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import type { IconComponent } from '$lib/utils/types';
	import clsx from 'clsx';

	export let src: IconComponent;
	export let size = 20;

	export let ml = false;
	export let mr = false;

	let className = '';
	export { className as class };

	$: classes = clsx(className, 'pointer-events-none', {
		'mr-2': mr,
		'ml-2': ml
	});
</script>

<svelte:component this={src} size={size.toString()} tabindex="-1" class={classes} />
