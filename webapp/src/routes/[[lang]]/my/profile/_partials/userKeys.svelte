<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Button, Heading, P } from 'flowbite-svelte';
	import CopyButton from '$lib/components/copyButton.svelte';
	import { capitalizeFirstLetter } from '$lib/utils/strings';
	import type { PublicKeys } from '$lib/keypairoom/utils';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { m } from '$lib/i18n';

	export let keys: PublicKeys | undefined = undefined;
</script>

<SectionTitle tag="h5" title={m.Your_keys()} />
{#if keys}
	<div class="flex flex-col gap-4">
		{#each Object.entries(keys) as [keyName, key]}
			{@const title = capitalizeFirstLetter(keyName.replaceAll('_', ' '))}
			<div class="flex w-full flex-row items-center justify-between gap-4">
				<div class="w-0 grow overflow-hidden">
					<div class="text-md max-w-sm font-semibold text-black">{title}</div>
					<div class="overflow-hidden text-ellipsis">{key}</div>
				</div>
				<div class="shrink-0">
					<CopyButton textToCopy={key} />
				</div>
			</div>
		{/each}
	</div>
{:else}
	<P>You have no keys yet.</P>
	<div class="mt-4 flex justify-end">
		<Button color="primary" size="sm" href="/keypairoom">Generate keyring</Button>
	</div>
{/if}
