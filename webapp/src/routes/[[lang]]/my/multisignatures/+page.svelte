<script lang="ts">
	import { Collections, type MultisignaturesResponse } from '$lib/pocketbase/types';
	import { CollectionManager, CollectionManagerHeader, DeleteRecord } from '$lib/collectionManager';
	import { createTypeProp } from '$lib/utils/typeProp';

	import { Eye, Plus } from 'svelte-heros-v2';
	import { Button, Heading } from 'flowbite-svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { m } from '$lib/i18n';
	import PlainCard from '$lib/components/plainCard.svelte';
	import Icon from '$lib/components/icon.svelte';
	import CollectionEmptyState from '$lib/collectionManager/ui/collectionEmptyState.svelte';
	import { Trash } from 'svelte-heros';

	//

	const recordType = createTypeProp<MultisignaturesResponse>();
</script>

<PageTop>
	<SectionTitle title={m.multisignatures()}></SectionTitle>
</PageTop>

<PageContent>
	<PageCard>
		<CollectionManager
			{recordType}
			collection={Collections.Multisignatures}
			let:records
			hideEmptyState
		>
			<SectionTitle title={m.multisignatures()}>
				<div slot="right" class="flex gap-2">
					<Button color="alternative" href="/my/multisignatures/seals">
						<Eye /><span class="ml-2">{m.View_seals()}</span>
					</Button>
					<Button href="/my/multisignatures/create">
						<Plus /><span>{m.Create_a_new_multisignature()}</span>
					</Button>
				</div>
			</SectionTitle>

			<CollectionEmptyState slot="emptyState" hideCreateButton></CollectionEmptyState>

			<div class="space-y-4">
				{#each records as record}
					<PlainCard let:Title>
						<Title>{record.name}</Title>
						<svelte:fragment slot="right">
							<Button outline href={`/my/multisignatures/${record.id}`}>
								{m.View()}
								<Icon src={Eye} ml />
							</Button>
							<DeleteRecord {record} let:openModal>
								<Button outline on:click={openModal}>
									{m.Delete()}
									<Icon src={Trash} ml />
								</Button>
							</DeleteRecord>
						</svelte:fragment>
					</PlainCard>
				{/each}
			</div>
		</CollectionManager>
	</PageCard>
</PageContent>
