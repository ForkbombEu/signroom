<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	export let label: string | undefined = undefined;
</script>

<div class="space-y-1">
	{#if label}
		<p class="text-sm">{label}</p>
	{/if}

	<div class="rounded-lg bg-gray-100 px-3 py-2 text-gray-500">
		<slot />
	</div>
</div>
