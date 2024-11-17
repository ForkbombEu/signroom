<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import EmailInputForm from './emailInputForm.svelte';
	import EmailReviewForm from './emailReviewForm.svelte';

	import Icon from '@/components/custom/icon.svelte';
	import { ArrowLeft, Mail, X } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';

	import { m } from '@/i18n';
	import { pb } from '@/pocketbase';

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
			<Button variant="outline" on:click={() => (state = 'input')}>
				<Icon src={ArrowLeft} size={16} mr />{m.Back()}
			</Button>
			<div class="flex items-center gap-2">
				<Button variant="outline" on:click={onCancel}>
					<Icon src={X} mr />
					{m.Cancel()}
				</Button>
				<Button on:click={() => handleSuccess(emails)}>
					<Icon src={Mail} mr />
					{m.Send_invites()}
				</Button>
			</div>
		</div>
	</div>
{/if}
