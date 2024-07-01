<script lang="ts">
	import { CollectionManager } from '$lib/collectionManager';
	import PageCard from '$lib/components/pageCard.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { Collections } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import SignatureTypeChip from '../_partials/signatureTypeChip.svelte';
	import type { FoldersResponse } from '$lib/pocketbase/types';
	import type { Signature } from '$lib/signatures/types';
	import PageContent from '$lib/components/pageContent.svelte';
	import { Button } from 'flowbite-svelte';
	import { m } from '$lib/i18n';
	import { ArrowDownTray, ArrowLeft } from 'svelte-heros-v2';
	import Icon from '$lib/components/icon.svelte';
	import { downloadSignedFile } from '$lib/signatures';
	import { downloadFileFromUrl } from '$lib/utils/clientFileDownload';
	import OwnerDisplay from './_partials/OwnerDisplay.svelte';

	//

	const signatureTypeProp = createTypeProp<Signature<{ folder: FoldersResponse }>>();

	function downloadSignatureOriginalFile(signature: Signature) {
		const fileUrl = pb.getFileUrl(signature, signature.file);
		downloadFileFromUrl(fileUrl, signature.file);
	}
</script>

<PageContent>
	<PageCard>
		<Button outline href="/my/signatures">
			<Icon src={ArrowLeft} mr />
			{m.Back_to_signatures()}
		</Button>
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
					<PlainCard let:Title let:Description>
						<div class="flex items-center gap-2">
							<Title>{signature.title}</Title>
							<SignatureTypeChip type={signature.type} />
						</div>
						{#if signature.description}
							<Description>{signature.description}</Description>
						{/if}
						<div class="mt-1 flex items-center gap-2 text-sm">
							<p class="text-gray-400">Owner:</p>
							<OwnerDisplay userId={signature.owner} />
						</div>

						<svelte:fragment slot="right">
							<Button
								class="py-2"
								color="alternative"
								on:click={() => downloadSignedFile(signature)}
							>
								<Icon src={ArrowDownTray} mr />
								{m.Signed_file()}
							</Button>
							<Button
								class="py-2"
								color="alternative"
								on:click={() => downloadSignatureOriginalFile(signature)}
							>
								<Icon src={ArrowDownTray} mr />
								{m.Original_file()}
							</Button>
						</svelte:fragment>
					</PlainCard>
				{/each}
			</div>
		</CollectionManager>
	</PageCard>
</PageContent>
