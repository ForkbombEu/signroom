<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import IconButton from '$lib/components/iconButton.svelte';
	import { m } from '$lib/i18n';
	import { Array as A } from 'effect';
	import { Input, Label } from 'flowbite-svelte';

	//

	export let emails: string[] = [];

	let filterText: string | undefined = undefined;

	function filterEmails(emails: string[], text: string | undefined) {
		if (!Boolean(text)) return emails;
		return emails.filter((e) => e.includes(text ?? ''));
	}

	function removeEmail(email: string) {
		emails = A.remove(emails, emails.indexOf(email));
	}
</script>

<div class="space-y-4">
	<p>{m.Review_the_email_list_before_sending()}</p>

	<div class="space-y-2">
		<Label>{m.Search_emails()} ({emails.length})</Label>
		<Input placeholder="mail@example.org" bind:value={filterText} />
	</div>

	<div class="h-[300px] divide-y overflow-scroll rounded-lg border">
		{#each filterEmails(emails, filterText) as email}
			<div class="flex items-center justify-between py-1 pl-4 pr-2">
				<p class="text-sm">{email}</p>
				<IconButton on:click={() => removeEmail(email)} />
			</div>
		{/each}
	</div>
</div>
