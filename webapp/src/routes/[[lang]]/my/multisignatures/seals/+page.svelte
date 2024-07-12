<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import {
		Collections,
		type MultisignatureSealsResponse,
		type MultisignaturesResponse,
		MultisignatureSealsStatusOptions
	} from '$lib/pocketbase/types';
	import { CollectionManager, CollectionEmptyState } from '$lib/collectionManager';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { currentUser } from '$lib/pocketbase';

	import { ArrowLeft } from 'svelte-heros-v2';
	import { Button, Badge } from 'flowbite-svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import Icon from '$lib/components/icon.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';

	//

	const multisignatureExpand = 'multisignature';

	type Seals = MultisignatureSealsResponse<
		unknown,
		{ [multisignatureExpand]: MultisignaturesResponse }
	>;
	const recordType = createTypeProp<Seals>();

	const { pending, signed, declined } = MultisignatureSealsStatusOptions;
</script>

<PageTop>
	<Button outline href="/my/multisignatures">
		<Icon src={ArrowLeft} mr />
		Back to Multisignatures
	</Button>
	<SectionTitle title="Multisignatures Seals" hideLine />
</PageTop>

<PageContent>
	<PageCard>
		<CollectionManager
			{recordType}
			collection={Collections.MultisignatureSeals}
			let:records
			hideEmptyState
			initialQueryParams={{
				filter: `owner.id = '${$currentUser?.id}'`,
				expand: multisignatureExpand
			}}
		>
			<svelte:fragment slot="emptyState">
				<CollectionEmptyState
					hideCreateButton
					title="No pending seals to sign"
					description="Pending seals will appear here."
				/>
			</svelte:fragment>

			{#each records as record}
				<PlainCard let:Title>
					<Title>
						{record.expand?.[multisignatureExpand].name}
					</Title>
					{#if record.status == pending}
						<Badge color="yellow">Pending</Badge>
					{/if}

					<div slot="right">
						{#if record.status == pending}
							<Button outline href={`/my/multisignatures/seals/${record.id}`}>Sign</Button>
						{/if}
					</div>
				</PlainCard>
			{/each}
		</CollectionManager>
	</PageCard>
</PageContent>
