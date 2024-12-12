<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import {
		type Expiration,
		expirationModeSchema,
		type ExpirationMode
	} from '$lib/issuanceFlows/expiration';
	import { Label, Select, type SelectOptionType } from 'flowbite-svelte';
	import DateField from './dateField.svelte';
	import DurationField from './durationField.svelte';
	import { m } from '$lib/i18n';
	import { unixNow } from '$lib/issuanceFlows/utils';

	//

	const defaultValues: Record<ExpirationMode, Expiration> = {
		date: {
			mode: 'date',
			date: unixNow()
		},
		duration: {
			mode: 'duration',
			duration: {
				years: 0,
				months: 0,
				days: 0
			}
		}
	};

	//

	export let expiration: Expiration = defaultValues['duration'];

	//

	const items: SelectOptionType<ExpirationMode>[] = Object.entries(expirationModeSchema.Values).map(
		([_, mode]) => ({
			name: mode,
			value: mode
		})
	);

	function updateDefaultValue(e: Event) {
		// @ts-expect-error Value is not defined
		expiration = defaultValues[e.target.value];
	}
</script>

<div class="expiration-field flex items-end gap-8">
	<div class="space-y-2">
		<Label>{m.Mode()}</Label>
		<Select {items} bind:value={expiration.mode} class="w-30" on:change={updateDefaultValue} />
	</div>
	{#key expiration.mode}
		{#if expiration.mode == 'date' && 'date' in expiration}
			<DateField bind:date={expiration.date} />
		{:else if expiration.mode == 'duration' && 'duration' in expiration}
			<DurationField bind:duration={expiration.duration} />
		{/if}
	{/key}
</div>

<style lang="postcss">
	:global(.expiration-field > * > label) {
		font-weight: normal !important;
		@apply text-xs;
	}
</style>
