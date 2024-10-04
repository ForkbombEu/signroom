<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import EmailInputForm from './emailInputForm.svelte';
	import EmailReviewForm from './emailReviewForm.svelte';

	import Icon from '$lib/components/icon.svelte';
	import { Button } from 'flowbite-svelte';
	import { ArrowLeft, Envelope, XMark } from 'svelte-heros-v2';

	import { m } from '$lib/i18n';
	import { pb } from '$lib/pocketbase';

	//

	export let organizationId: string;
	export let onSuccess: (emails: string[]) => void = () => {};
	export let onCancel = () => {};

	let state: 'input' | 'review' = 'input';
	let emails: string[] = [];

	function handleInputFormSuccess(inputEmails: string[]) {
		emails = inputEmails;
		state = 'review';
	}

	function handleSuccess(emails: string[]) {
		pb.send('/organizations/invite', {
			method: 'POST',
			body: {
				organizationId,
				emails
			}
		});
		onSuccess(emails);
	}
</script>

{#if state == 'input'}
	<EmailInputForm onSuccess={handleInputFormSuccess} />
{:else if state == 'review'}
	<div>
		<EmailReviewForm bind:emails />
		<div class="flex items-center justify-between gap-4 pt-6">
			<Button outline on:click={() => (state = 'input')}>
				<Icon src={ArrowLeft} size={16} mr />{m.Back()}
			</Button>
			<div class="flex items-center gap-2">
				<Button outline on:click={onCancel}>
					<Icon src={XMark} mr />
					{m.Cancel()}
				</Button>
				<Button on:click={() => handleSuccess(emails)}>
					<Icon src={Envelope} mr />
					{m.Send_invites()}
				</Button>
			</div>
		</div>
	</div>
{/if}
