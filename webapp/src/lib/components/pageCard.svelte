<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import Card from './card.svelte';

	let className = '';
	export { className as class };
</script>

<Card class={`space-y-8 rounded-xl p-8 ${className}`}>
	<slot />
</Card>
