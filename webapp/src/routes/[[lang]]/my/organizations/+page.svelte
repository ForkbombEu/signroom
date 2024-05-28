<script lang="ts">
	import { OrgRoles } from '$lib/rbac';
	import { Heading, Button, A, P, Badge, Avatar } from 'flowbite-svelte';
	import { Plus, UserPlus, Cog, PuzzlePiece, ArrowUturnLeft } from 'svelte-heros-v2';
	import { c } from '$lib/utils/strings.js';
	import { pb } from '$lib/pocketbase/index.js';
	import { Collections } from '$lib/pocketbase/types.js';
	import { invalidateAll } from '$app/navigation';
	import { m } from '$lib/i18n';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import PageTop from '$lib/components/pageTop.svelte';
	import Icon from '$lib/components/icon.svelte';
	import PageContent from '$lib/components/pageContent.svelte';
	import EmptyState from '$lib/components/emptyState.svelte';
	import PlainCard from '$lib/components/plainCard.svelte';

	export let data;
	$: authorizations = data.authorizations;
	$: orgJoinRequests = data.orgJoinRequests;

	const { ADMIN, OWNER } = OrgRoles;

	async function deleteJoinRequest(requestId: string) {
		await pb.collection(Collections.OrgJoinRequests).delete(requestId);
		invalidateAll();
	}
</script>

<PageTop>
	<SectionTitle title={m.My_organizations()} description={m.organzations_page_description()} />
</PageTop>

<PageContent>
	{#if orgJoinRequests.length}
		<PageCard>
			<SectionTitle tag="h5" title={m.Your_membership_requests()}></SectionTitle>

			<div class="space-y-4">
				{#each orgJoinRequests as request}
					{@const organization = request.expand?.organization}
					{#if organization}
						{@const avatarUrl = pb.files.getUrl(organization, organization.avatar)}
						<PlainCard>
							<Avatar slot="left" src={avatarUrl}></Avatar>

							<div class="flex items-center space-x-2">
								<P>{request.expand?.organization.name}</P>
								<Badge color="yellow">{m.Pending()}</Badge>
							</div>

							<Button
								slot="right"
								outline
								size="sm"
								on:click={() => {
									deleteJoinRequest(request.id);
								}}
							>
								{m.Undo_request()}
								<Icon src={ArrowUturnLeft} ml></Icon>
							</Button>
						</PlainCard>
					{/if}
				{/each}
			</div>
		</PageCard>
	{/if}

	<PageCard>
		<SectionTitle tag="h5" title={m.Your_organizations()}>
			<div slot="right" class="flex justify-end gap-2">
				<Button size="sm" outline class="shrink-0 !px-4" href="/my/organizations/join">
					<span class="ml-1"> {m.Join_an_organization()} </span>
					<Icon src={UserPlus} ml />
				</Button>
				<Button size="sm" class="shrink-0 !px-4" href="/my/organizations/create">
					<span class="ml-1"> {m.Create_a_new_organization()} </span>
					<Icon src={Plus} ml />
				</Button>
			</div>
		</SectionTitle>

		<div class="space-y-4">
			{#if authorizations}
				{#if authorizations.length == 0}
					<EmptyState title={m.You_havent_added_any_organizations_yet_()} icon={PuzzlePiece} />
				{:else}
					{#each authorizations as a}
						{@const org = a.expand.organization}
						{@const role = a.expand.role}

						<PlainCard let:Title let:Description>
							<div class="flex items-center gap-2">
								<Title>
									<A href={`/my/organizations/${org.id}`}>{org.name}</A>
								</Title>
								{#if role.name == ADMIN || role.name == OWNER}
									<Badge color="dark">{c(role.name)}</Badge>
								{/if}
							</div>
							{#if org.description}
								<Description>{org.description}</Description>
							{/if}

							<svelte:fragment slot="right">
								{#if role.name == OWNER}
									<Button
										data-testid={`${org.name} link`}
										size="sm"
										outline
										href={`/my/organizations/${org.id}/settings`}
									>
										{m.Settings()}
										<Icon src={Cog} ml></Icon>
									</Button>
								{/if}
							</svelte:fragment>
						</PlainCard>
					{/each}
				{/if}
			{/if}
		</div>
	</PageCard>
</PageContent>
