<script lang="ts">
	import { CollectionManager, DeleteRecord } from '$lib/collectionManager';
	import { Collections, type IssuersResponse } from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { Button } from 'flowbite-svelte';
	import { m } from '$lib/i18n';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import CreateRecord from '$lib/collectionManager/ui/recordActions/createRecord.svelte';
	import OrganizationLayout from '$lib/components/organizationLayout.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import { Plus, Trash } from 'svelte-heros-v2';
	import Icon from '$lib/components/icon.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';
	import EditRecord from '$lib/collectionManager/ui/recordActions/editRecord.svelte';
	import { Pencil } from 'svelte-heros';
	import { ProtectedOrgUI } from '$lib/rbac';

	export let data;
	let { organization } = data;

	const recordType = createTypeProp<IssuersResponse>();
</script>

<OrganizationLayout org={data.organization}>
	<div class="space-y-10">
		<PageCard>
			<CollectionManager
				{recordType}
				collection={Collections.Issuers}
				formSettings={{
					hide: { organization: data.organization.id },
					descriptions: {
						name: m.microservice_name_description(),
						endpoint: m.microservice_endpoint_description()
					}
				}}
				let:records
			>
				<SectionTitle
					tag="h5"
					title={m.Credential_issuers()}
					description={m.credential_issuer_description()}
				>
					<CreateRecord slot="right" modalTitle={`${m.Add_new()} – ${m.Credential_issuer()}`}>
						<svelte:fragment slot="button" let:openModal>
							<Button on:click={openModal}>
								{m.Add_new()}
								<Icon src={Plus} ml></Icon>
							</Button>
						</svelte:fragment>
					</CreateRecord>
				</SectionTitle>

				<div class="space-y-4">
					{#each records as record}
						<PlainCard let:Title let:Description>
							<Title>{record.name}</Title>
							<Description>
								<span class="font-bold mr-2">{m.Endpoint()}:</span>
								{record.endpoint}
							</Description>

							<svelte:fragment slot="right">
								<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
									<div class="flex gap-2">
										<EditRecord
											{record}
											let:openModal
											modalTitle={`${m.Edit()} – ${m.Credential_issuer()}`}
										>
											<Button outline on:click={openModal}>
												{m.Edit()}
												<Icon src={Pencil} ml></Icon>
											</Button>
										</EditRecord>

										<DeleteRecord
											{record}
											let:openModal
											modalTitle={`${m.Delete()} – ${m.Credential_issuer()}`}
										>
											<Button outline on:click={openModal}>
												<Icon src={Trash} />
											</Button>
										</DeleteRecord>
									</div>
								</ProtectedOrgUI>
							</svelte:fragment>
						</PlainCard>
					{/each}
				</div>
			</CollectionManager>
		</PageCard>

		<PageCard>
			<CollectionManager
				{recordType}
				collection={Collections.AuthorizationServers}
				formSettings={{
					hide: { organization: data.organization.id },
					descriptions: {
						name: m.microservice_name_description(),
						endpoint: m.microservice_endpoint_description()
					}
				}}
				let:records
			>
				<SectionTitle
					tag="h5"
					title={m.Authorization_servers()}
					description={m.authorization_server_description()}
				>
					<CreateRecord slot="right" modalTitle={`${m.Add_new()} – ${m.Authorization_server()}`}>
						<svelte:fragment slot="button" let:openModal>
							<Button on:click={openModal}>
								{m.Add_new()}
								<Icon src={Plus} ml></Icon>
							</Button>
						</svelte:fragment>
					</CreateRecord>
				</SectionTitle>

				<div class="space-y-4">
					{#each records as record}
						<PlainCard let:Title let:Description>
							<Title>{record.name}</Title>
							<Description>
								<span class="font-bold mr-2">{m.Endpoint()}:</span>
								{record.endpoint}
							</Description>

							<svelte:fragment slot="right">
								<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
									<div class="flex gap-2">
										<EditRecord
											{record}
											let:openModal
											modalTitle={`${m.Edit()} – ${m.Authorization_server()}`}
										>
											<Button outline on:click={openModal}>
												{m.Edit()}
												<Icon src={Pencil} ml></Icon>
											</Button>
										</EditRecord>

										<DeleteRecord
											{record}
											let:openModal
											modalTitle={`${m.Delete()} – ${m.Authorization_server()}`}
										>
											<Button outline on:click={openModal}>
												<Icon src={Trash} />
											</Button>
										</DeleteRecord>
									</div>
								</ProtectedOrgUI>
							</svelte:fragment>
						</PlainCard>
					{/each}
				</div>
			</CollectionManager>
		</PageCard>

		<PageCard>
			<CollectionManager
				{recordType}
				collection={Collections.RelyingParties}
				formSettings={{
					hide: { organization: data.organization.id },
					descriptions: {
						name: m.microservice_name_description(),
						endpoint: m.microservice_endpoint_description()
					}
				}}
				let:records
			>
				<SectionTitle
					tag="h5"
					title={m.Relying_parties()}
					description={m.relying_party_description()}
				>
					<CreateRecord slot="right" modalTitle={`${m.Add_new()} – ${m.Relying_party()}`}>
						<svelte:fragment slot="button" let:openModal>
							<Button on:click={openModal}>
								{m.Add_new()}
								<Icon src={Plus} ml></Icon>
							</Button>
						</svelte:fragment>
					</CreateRecord>
				</SectionTitle>

				<div class="space-y-4">
					{#each records as record}
						<PlainCard let:Title let:Description>
							<Title>{record.name}</Title>
							<Description>
								<span class="font-bold mr-2">{m.Endpoint()}:</span>
								{record.endpoint}
							</Description>

							<svelte:fragment slot="right">
								<ProtectedOrgUI orgId={organization.id} roles={['admin', 'owner']}>
									<div class="flex gap-2">
										<EditRecord
											{record}
											let:openModal
											modalTitle={`${m.Edit()} – ${m.Relying_party()}`}
										>
											<Button outline on:click={openModal}>
												{m.Edit()}
												<Icon src={Pencil} ml></Icon>
											</Button>
										</EditRecord>

										<DeleteRecord
											{record}
											let:openModal
											modalTitle={`${m.Delete()} – ${m.Relying_party()}`}
										>
											<Button outline on:click={openModal}>
												<Icon src={Trash} />
											</Button>
										</DeleteRecord>
									</div>
								</ProtectedOrgUI>
							</svelte:fragment>
						</PlainCard>
					{/each}
				</div>
			</CollectionManager>
		</PageCard>
	</div>
</OrganizationLayout>
