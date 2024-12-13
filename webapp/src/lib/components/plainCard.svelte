<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import Title from './plainCardTitle.svelte';
	import Description from './plainCardDescription.svelte';

	let className = '';
	export { className as class };
</script>

<div class="flex items-center gap-4 rounded-lg border p-5 {className}">
	{#if $$slots.left}
		<div class="flex shrink-0 items-center">
			<slot name="left" />
		</div>
	{/if}

	<div class="grow">
		<slot {Title} {Description} />
	</div>

	{#if $$slots.right}
		<div class="shrink-0">
			<slot name="right" />
		</div>
	{/if}
</div>
