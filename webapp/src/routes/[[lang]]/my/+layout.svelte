<script lang="ts">
	import { currentUser } from '$lib/pocketbase';

	import {
		UIShell,
		Sidebar,
		Logo,
		SidebarLinks,
		MainContent,
		SidebarCloseButton,
		Topbar,
		HamburgerButton
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
	import { OrgRoles, getUserRole } from '$lib/rbac';
	import { m } from '$lib/i18n';
	import UserAvatar from '$lib/components/userAvatar.svelte';
	import { getUserDisplayName } from '$lib/utils/pb';
	import Icon from '$lib/components/icon.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import LanguageSwitcher from '$lib/i18n/languageSwitcher.svelte';
	import { appTitle } from '$lib/strings';
	import { version } from '$app/environment';

	//

	export let data;
	let { authorizations } = data;

	let sidebarLayoutBreakpoint = 1024;
</script>

<UIShell {sidebarLayoutBreakpoint}>
	<svelte:fragment slot="top" let:sidebarLayoutMode>
		{#if sidebarLayoutMode == 'drawer'}
			<Topbar>
				<svelte:fragment slot="left">
					<div class="flex space-x-2">
						<Logo />
					</div>
				</svelte:fragment>
				<svelte:fragment slot="center">
					<div class="flex items-center">
						{#if $currentUser}
							<span class="whitespace-nowrap">
								{m.hello()},
								<span class="font-semibold text-primary-600">
									{getUserDisplayName($currentUser)}
								</span>
							</span>
						{/if}
					</div>
				</svelte:fragment>
				<svelte:fragment slot="right">
					<HamburgerButton />
				</svelte:fragment>
			</Topbar>
		{/if}
	</svelte:fragment>

	<Sidebar darkMode>
		<svelte:fragment slot="top">
			<div class="flex items-center py-2.5 px-3 justify-between border-b border-gray-600">
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
						{#each authorizations as authorization}
							{@const organization = authorization.expand.organization}
							{@const organizationId = organization.id}
							{@const userId = $currentUser?.id ?? ''}
							{#await getUserRole(organizationId, userId) then userRole}
								{@const links = createOrganizationSidebarLinks(organization, m, userRole)}
								<SidebarLinks {links} />
							{/await}
						{/each}
					{/if}
				</div>
			</SidebarGroup>
		</div>

		<svelte:fragment slot="bottom">
			<SidebarGroup>
				<SidebarLinks
					links={[
						{
							text: 'Help',
							icon: QuestionMarkCircle,
							href: 'https://forkbombeu.github.io/DIDroom/intro.html'
						}
					]}
				/>

				<LanguageSwitcher />

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

					<Dropdown triggeredBy={idSelector} class="w-[215px]">
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
			<div class="flex pt-1 border-t border-t-white/20 mt-2">
				<p class="text-white opacity-30 text-xs px-2 font-mono">{appTitle} – Version {version}</p>
			</div>
		</svelte:fragment>
	</Sidebar>

	<MainContent>
		<div class="bg-[url('/bg.png')] bg-cover min-h-screen overflow-auto">
			<slot />
		</div>
	</MainContent>
</UIShell>
