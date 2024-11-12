<script lang="ts">
	import { version } from '$app/environment';

	import { getUserDidUrl } from '@/did';
	import { featureFlags } from '@/features';
	import { m } from '@/i18n';
	import LanguageSelect from '@/i18n/languageSelect.svelte';

	import Logo from '@/components/layout/Logo.svelte';
	import { createOrganizationSidebarLinks } from '@/organizations';
	import { getUserRole } from '@/organizations/utils';
	import { appTitle } from '@/utils/strings';
	import { getUserDisplayName } from '@/pocketbase/utils';

	import { currentUser, pb } from '@/pocketbase';

	import Sidebar from '@/components/layout/sidebar/sidebar.svelte';
	import SidebarButton from '@/components/layout/sidebar/sidebarButton.svelte';
	import SidebarItems from '@/components/layout/sidebar/sidebarItems.svelte';
	import * as Popover from '@/components/ui/popover';
	import { Separator } from '@/components/ui/separator';
	import T from '@/components/custom/t.svelte';
	import type {
		OrganizationsResponse,
		OrgAuthorizationsResponse,
		OrgRolesResponse
	} from '@/pocketbase/types';

	import {
		ArrowUpRightFromSquare,
		Flame,
		Home,
		Inbox,
		CircleHelp,
		SquareStack,
		User,
		File
	} from 'lucide-svelte';

	//

	// TODO - Improve subscription
	function getOrgAuthorizations() {
		type Authorizations = Required<
			OrgAuthorizationsResponse<{
				organization: OrganizationsResponse;
				role: OrgRolesResponse;
			}>
		>;

		return pb.collection('orgAuthorizations').getFullList<Authorizations>({
			filter: `user = "${pb.authStore.model!.id}"`,
			expand: 'organization,role',
			fetch,
			requestKey: null
		});
	}
</script>

<Sidebar class="h-full">
	<svelte:fragment slot="top">
		<div class="px-3 py-2">
			<Logo />
		</div>
	</svelte:fragment>

	<div class="p-2">
		<SidebarItems
			links={[
				{
					text: m.Home(),
					href: '/my',
					icon: Home
				},
				{
					text: m.notifications(),
					icon: Inbox,
					href: '/my/notifications',
					disabled: true
				}
			]}
		/>
	</div>

	<Separator />

	{#if $featureFlags.ORGANIZATIONS}
		<div class="space-y-1 p-2">
			<div class="pb-1 pl-3 pt-1">
				<T tag="small" class=" text-xs font-bold uppercase tracking-wide">
					{m.organizations()}
				</T>
			</div>

			<div class="!mb-3">
				<SidebarItems
					links={[
						{
							text: m.My_organizations(),
							href: '/my/organizations',
							icon: SquareStack
						}
					]}
				/>
			</div>

			{#await getOrgAuthorizations() then authorizations}
				{#each authorizations as authorization}
					{@const organization = authorization.expand.organization}
					{@const organizationId = organization.id}
					{@const userId = $currentUser?.id ?? ''}
					{#await getUserRole(organizationId, userId) then userRole}
						{@const links = createOrganizationSidebarLinks(organization, m, userRole)}
						<SidebarItems {links} />
					{/await}
				{/each}
			{/await}
		</div>
	{/if}

	<svelte:fragment slot="bottom">
		<div class="p-2">
			<SidebarItems
				links={[
					{
						text: 'Help',
						icon: CircleHelp,
						href: '',
						disabled: true,
						target: '_blank'
					}
				]}
			/>

			<LanguageSelect>
				<svelte:fragment slot="trigger" let:builder let:icon let:text>
					<SidebarButton builders={[builder]} {icon} {text} />
				</svelte:fragment>
			</LanguageSelect>

			{#if $currentUser}
				{@const avatar = pb.getFileUrl($currentUser, 'avatar')}
				<Popover.Root>
					<Popover.Trigger asChild let:builder>
						<SidebarButton
							builders={[builder]}
							icon={avatar}
							text={getUserDisplayName($currentUser)}
						/>
					</Popover.Trigger>

					<Popover.Content class="space-y-1 p-2" sameWidth>
						<SidebarButton text={m.My_profile()} icon={User} href="/my/profile" />

						{#if $featureFlags.DID}
							{#await getUserDidUrl() then url}
								<SidebarButton href={url} text={m.my_DID()} icon={File} target="_blank" />
							{/await}
						{/if}

						<SidebarButton href="/pricing" icon={Flame} text={m.Go_Pro()} disabled />

						<Separator />

						<SidebarButton
							href="/logout"
							data-sveltekit-preload-data="off"
							text={m.Sign_out()}
							icon={ArrowUpRightFromSquare}
						/>
					</Popover.Content>
				</Popover.Root>
			{/if}
		</div>

		<div class=" flex border-t px-6 py-3">
			<T tag="small" class="text-secondary-foreground/50 text-wrap font-mono text-xs">
				{appTitle} – Version {version}
			</T>
		</div>
	</svelte:fragment>
</Sidebar>
