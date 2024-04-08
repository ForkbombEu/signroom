<script lang="ts">
	import { currentUser } from '$lib/pocketbase';

	import {
		UIShell,
		Sidebar,
		Logo,
		SidebarLinks,
		MainContent,
		SidebarCloseButton
	} from '$lib/layout';
	import {
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		Hr,
		SidebarDropdownWrapper,
		SidebarGroup
	} from 'flowbite-svelte';
	import {
		ArrowLeftStartOnRectangle,
		CheckCircle,
		Fire,
		Home,
		InboxArrowDown,
		QuestionMarkCircle,
		RectangleStack,
		User,
		Users,
		EllipsisHorizontal
	} from 'svelte-heros-v2';
	import { createOrganizationSidebarLinks } from '$lib/utils/organizations.js';
	import { OrgRoles } from '$lib/rbac';
	import { m } from '$lib/i18n';
	import UserAvatar from '$lib/components/userAvatar.svelte';
	import { getUserDisplayName } from '$lib/utils/pb';
	import Icon from '$lib/components/icon.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	//

	export let data;
	let { authorizations } = data;

	let sidebarLayoutBreakpoint = 1024;
</script>

<UIShell {sidebarLayoutBreakpoint}>
	<!-- <Topbar slot="top" let:sidebarLayoutMode>
		<svelte:fragment slot="left">
			<div class="flex space-x-2">
				<HamburgerButton />
				{#if sidebarLayoutMode == 'default'}
					<Logo />
				{/if}
			</div>
		</svelte:fragment>
		<svelte:fragment slot="center">
			<div class="flex items-center">
				<div>
					<span class="whitespace-nowrap">
						{m.hello()}, <span class="font-semibold text-primary-600">{$currentUser?.email}</span>
					</span>
				</div>
				<div class="shrink-0">
					<DIDButton />
				</div>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="right">
			<div class="mr-3">
				<LanguageSwitcher />
			</div>
			<AvatarMenu>
				<DropdownHeader>
					<span class="block truncate text-xs font-medium text-gray-500">
						{$currentUser?.email}
					</span>
				</DropdownHeader>
				<DropdownItem href="/my/profile">{m.My_profile()}</DropdownItem>
				<DropdownDivider />
				<DropdownItem href="/pro" class="flex items-center">
					<Fire class="text-red-500 mr-2 w-5" />{m.Go_Pro()}</DropdownItem
				>
				<DropdownDivider />
				<DropdownItem on:click={() => goto('/my/logout')} class="text-primary-600">
					{m.Sign_out()}
				</DropdownItem>
			</AvatarMenu>
		</svelte:fragment>
	</Topbar> -->

	<Sidebar darkMode>
		<svelte:fragment slot="top">
			<div class="flex items-center p-3">
				<Logo />
				<SidebarCloseButton />
			</div>
		</svelte:fragment>

		<div class="space-y-0">
			<SidebarGroup>
				<div class="p-3">
					<SidebarLinks
						links={[
							{
								text: m.Home(),
								href: '/my',
								icon: Home
							},
							{
								text: m.notifications(),
								icon: InboxArrowDown,
								href: '/my/notifications',
								disabled: true
							}
						]}
					/>
				</div>
			</SidebarGroup>

			<Hr />

			<p class="text-gray-500 text-xs font-medium tracking-wide p-4 uppercase">
				{m.signatures()}
			</p>

			<SidebarGroup>
				<div class="p-3 pt-0">
					<SidebarLinks
						links={[
							{
								text: m.my_signatures(),
								href: '/my/signatures',
								icon: RectangleStack
							},
							{
								text: m.multisignatures(),
								disabled: true,
								href: '/my/multisignatures',
								icon: Users
							},
							{
								text: m.validate_signatures(),
								href: '/my/validate',
								icon: CheckCircle
							}
						]}
					/>
				</div>
			</SidebarGroup>

			<Hr />

			<p class="text-gray-500 text-xs font-medium tracking-wide p-4 uppercase">
				{m.organizations()}
			</p>

			<SidebarGroup>
				<div class="p-3 pt-0 space-y-2">
					<SidebarLinks
						links={[
							{
								text: m.My_organizations(),
								href: '/my/organizations',
								icon: RectangleStack
							}
						]}
					/>
					{#if authorizations}
						{@const links = authorizations.flatMap((a) => {
							const userRole = a.expand.role.name;
							const isOwner = userRole == OrgRoles.OWNER;
							const isAdmin = userRole == OrgRoles.ADMIN;
							return createOrganizationSidebarLinks(a.expand.organization, m, isAdmin || isOwner);
						})}
						<SidebarLinks {links} />
					{/if}
				</div>
			</SidebarGroup>
		</div>

		<svelte:fragment slot="bottom">
			<SidebarGroup>
				<SidebarLinks
					links={[{ text: 'Help', disabled: true, icon: QuestionMarkCircle, href: '/help' }]}
				/>

				{#if $currentUser}
					{@const id = 'menu-trigger'}
					{@const idSelector = `#${id}`}
					<SidebarDropdownWrapper label={getUserDisplayName($currentUser)} ulClass="hidden" {id}>
						<svelte:fragment slot="icon">
							<UserAvatar size="sm" />
						</svelte:fragment>

						<svelte:fragment slot="arrowdown">
							<EllipsisHorizontal />
						</svelte:fragment>
						<svelte:fragment slot="arrowup">
							<EllipsisHorizontal />
						</svelte:fragment>
					</SidebarDropdownWrapper>

					<Dropdown triggeredBy={idSelector} class="min-w-[215px]">
						<DropdownHeader>
							<span class="block truncate text-xs font-medium text-gray-500">
								{getUserDisplayName($currentUser)}
							</span>
						</DropdownHeader>
						<DropdownItem href="/my/profile" class="flex">
							<Icon src={User} mr />
							{m.My_profile()}
						</DropdownItem>

						<DropdownDivider />

						<DropdownItem href="/" class="flex cursor-default pointer-events-none opacity-30">
							<Icon src={Fire} mr class="dark:text-red-400 text-red-700" />
							{m.Go_Pro()}
						</DropdownItem>

						<DropdownDivider />

						<DropdownItem
							on:click={() => goto('/my/logout')}
							class="flex dark:text-red-400 text-red-700"
						>
							<Icon src={ArrowLeftStartOnRectangle} mr />
							{m.Sign_out()}
						</DropdownItem>
					</Dropdown>
				{/if}
			</SidebarGroup>
		</svelte:fragment>
	</Sidebar>

	<MainContent>
		<div class="bg-[url('/bg.png')] bg-cover min-h-screen overflow-auto">
			<slot />
		</div>
	</MainContent>
</UIShell>
