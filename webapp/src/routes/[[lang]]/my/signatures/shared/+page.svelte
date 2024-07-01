<script lang="ts">
	import { CollectionManager } from '$lib/collectionManager';

	import PageCard from '$lib/components/pageCard.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { currentUser } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import SignatureTypeChip from '../_partials/signatureTypeChip.svelte';
	import type { FoldersResponse } from '$lib/pocketbase/types';
	import type { Signature } from '$lib/signatures/types';

	const signatureTypeProp = createTypeProp<Signature<{ folder: FoldersResponse }>>();
</script>

<PageCard>
	<CollectionManager
		recordType={signatureTypeProp}
		collection={Collections.Signatures}
		initialQueryParams={{
			filter: `owner.id != "${$currentUser?.id}"`
		}}
		let:records
		hideEmptyState
	>
		<SectionTitle title="Signatures shared with you" />

		<div class="space-y-2">
			{#each records as signature}
				<PlainCard let:Title let:Description class="py-2.5">
					<div class="flex items-center gap-2">
						<Title>{signature.title}</Title>
						<SignatureTypeChip type={signature.type} />
					</div>
					{#if signature.description}
						<Description>{signature.description}</Description>
					{/if}
				</PlainCard>
			{/each}
		</div>
	</CollectionManager>
</PageCard>
