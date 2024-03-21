<script lang="ts">
	import { OrgRoles } from '$lib/rbac';
	import { Heading, Button, A, P, Badge } from 'flowbite-svelte';
	import { ProtectedOrgUI } from '$lib/rbac';
	import { Plus, UserPlus } from 'svelte-heros-v2';
	import { c } from '$lib/utils/strings.js';
	import { pb } from '$lib/pocketbase/index.js';
	import { Collections } from '$lib/pocketbase/types.js';
	import { invalidateAll } from '$app/navigation';
	import { m } from '$lib/i18n';
	import SectionTitle from '$lib/components/sectionTitle.svelte';

	export let data;
	$: authorizations = data.authorizations;
	$: orgJoinRequests = data.orgJoinRequests;

	const { ADMIN, OWNER } = OrgRoles;

	async function deleteJoinRequest(requestId: string) {
		await pb.collection(Collections.OrgJoinRequests).delete(requestId);
		invalidateAll();
	}
</script>

<div class="mb-8">
	<SectionTitle title={m.My_organizations()} description={m.organzations_page_description()} />
</div>

<div class="flex justify-between items-center mb-6">
	<Heading tag="h5">{m.Your_organizations()}</Heading>
	<div class="flex justify-end gap-2">
		<Button size="sm" color="alternative" class="!px-4 shrink-0" href="/my/organizations/join">
			<UserPlus size="20" />
			<span class="ml-1"> {m.Join_an_organization()} </span>
		</Button>
		<Button size="sm" color="alternative" class="!px-4 shrink-0" href="/my/organizations/create">
			<Plus size="20" />
			<span class="ml-1"> {m.Create_a_new_organization()} </span>
		</Button>
	</div>
</div>

<div class="border rounded-lg divide-y">
	{#if authorizations}
		{#if authorizations.length == 0}
			<div class="p-4 text-gray-600">{m.No_organizations_found_Create_one()}</div>
		{:else}
			{#each authorizations as a}
				{@const org = a.expand.organization}
				{@const role = a.expand.role}
				<div class="px-4 py-3 flex justify-between items-center">
					<div class="flex items-center space-x-4">
						<A href={`/my/organizations/${org.id}`}>{org.name}</A>
						{#if role.name == ADMIN || role.name == OWNER}
							<Badge large color="dark">{c(role.name)}</Badge>
						{/if}
					</div>
					<ProtectedOrgUI orgId={org.id} roles={[ADMIN, OWNER]}>
						<Button
							data-testid={`${org.name} link`}
							size="sm"
							color="alternative"
							href={`/my/organizations/${org.id}/settings`}
						>
							{m.Settings()}
						</Button>
					</ProtectedOrgUI>
				</div>
			{/each}
		{/if}
	{/if}
</div>

{#if orgJoinRequests.length}
	<div class="mt-8 space-y-4">
		<Heading tag="h5">{m.Your_join_requests()}</Heading>
		<div class="border rounded-lg divide-y">
			{#each orgJoinRequests as request}
				<div class="flex items-center justify-between space-x-4 py-3 px-4">
					<div class="flex space-x-2">
						<P>{request.expand?.organization.name}</P>
						<Badge large color="yellow">{m.Pending()}</Badge>
					</div>
					<Button
						color="alternative"
						size="sm"
						on:click={() => {
							deleteJoinRequest(request.id);
						}}
					>
						{m.Undo_request()}
					</Button>
				</div>
			{/each}
		</div>
	</div>
{/if}
