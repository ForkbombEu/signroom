<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import NruLayout from '$lib/components/nruLayout.svelte';
	import { m } from '$lib/i18n';
	import { currentUser } from '$lib/pocketbase/index.js';
	import { Button, Heading, P } from 'flowbite-svelte';

	export let data;
</script>

<NruLayout>
	{#if data.error}
		<div class="space-y-4">
			<Heading tag="h4">{m.Oh_no()}</Heading>
			<P>{m.An_error_occurred_while_verifying_your_email_()}</P>
		</div>
	{:else if data.verified}
		<div class="space-y-4">
			<Heading tag="h4">{m.Email_verified_succesfully()}</Heading>
			{#if !currentUser}
				<Button href="/login" class="w-full">{m.Go_to_login()}</Button>
			{:else}
				<Button href="/my" class="w-full">{m.Go_to_Dashboard()}</Button>
			{/if}
		</div>
	{/if}
</NruLayout>
