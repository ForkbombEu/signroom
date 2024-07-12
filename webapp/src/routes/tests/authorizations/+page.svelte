<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	export let data;
</script>

{#if data.data}
	<p>User authorized!</p>
	<pre id="protected">{JSON.stringify(data.data, null, 2)}</pre>
{/if}

{#if data.error}
	<p>User not authorized</p>
{/if}
