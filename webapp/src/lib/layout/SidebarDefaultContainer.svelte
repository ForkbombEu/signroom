<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import clsx from 'clsx';
	import { getUIShellContext } from './UiShell.svelte';
	import { slide } from 'svelte/transition';

	export let width = 'w-40';
	export let darkMode = false;

	const { isSidebarHidden } = getUIShellContext();

	$: classes = clsx('flex flex-col ', width, { dark: darkMode });
</script>

{#if !$isSidebarHidden}
	<div transition:slide={{ axis: 'x' }} class={classes}>
		<slot />
	</div>
{/if}
