<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { goto } from '$lib/i18n';

	import {
		UIShell,
		Sidebar,
		Topbar,
		HamburgerButton,
		AvatarMenu,
		Logo,
		SidebarLinks,
		MainContent,
		SidebarCloseButton
	} from '$lib/layout';
	import {
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		Heading,
		Hr,
		P,
		SidebarCta,
		SidebarGroup,
		SidebarItem
	} from 'flowbite-svelte';
	import DIDButton from '$lib/components/DIDButton.svelte';
	import { Fire, Lifebuoy, UserCircle, WrenchScrewdriver } from 'svelte-heros-v2';
	import { createSidebarLinks } from './_partials/sidebarLinks';
	import { createOrganizationLinks } from './_partials/organizationLinks';
	import { OrgRoles } from '$lib/rbac';
	import LanguageSwitcher from '$lib/i18n/languageSwitcher.svelte';
	import { m } from '$lib/i18n';

	//

	export let data;
	let { authorizations } = data;

	let sidebarLayoutBreakpoint = 1024;
</script>

<UIShell {sidebarLayoutBreakpoint}>
	<Topbar slot="top" let:sidebarLayoutMode>
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
				<DropdownItem href="/my/profile">My profile</DropdownItem>
				<DropdownDivider />
				<DropdownItem href="/pro" class="flex items-center">
					<Fire class="text-red-500 mr-2 w-5" /> Go Pro</DropdownItem
				>
				<DropdownDivider />
				<DropdownItem on:click={() => goto('/my/logout')} class="text-primary-600">
					Sign out
				</DropdownItem>
			</AvatarMenu>
		</svelte:fragment>
	</Topbar>

	<Sidebar>
		<svelte:fragment slot="top">
			<div class="flex items-center p-3">
				<Logo />
				<SidebarCloseButton />
			</div>
		</svelte:fragment>

		<div class="space-y-0">
			<div class="p-3">
				<SidebarLinks links={createSidebarLinks(m)} />
			</div>
			{#if authorizations}
				{@const links = authorizations.flatMap((a) => {
					const userRole = a.expand.role.name;
					const isOwner = userRole == OrgRoles.OWNER;
					const isAdmin = userRole == OrgRoles.ADMIN;
					return createOrganizationLinks(a.expand.organization, isAdmin || isOwner);
				})}
				<Hr />
				<p class="text-gray-500 text-xs font-medium tracking-wide p-4">ORGANIZATIONS</p>
				<div class="p-3 pt-0">
					<SidebarLinks {links} />
				</div>
			{/if}
		</div>

		<svelte:fragment slot="bottom">
			<SidebarGroup class="px-2">
				<!-- <SidebarCta label="Beta">
					<p class="mb-3 text-sm text-blue-900 dark:text-blue-400">
						You are one of the lucky few to try Signroom and all of its feature offerings first
						before anyone else.
					</p>
					<a
						class="text-sm text-blue-900 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
						href="https://github.com/ForkbombEu/signroom"
					>
						Please provide us feedbacks and suggestions for how to make it better.
					</a>
				</SidebarCta> -->
				<SidebarItem
					label="Settings"
					href="/my/settings"
					class="opacity-20 hover:bg-transparent cursor-default"
				>
					<svelte:fragment slot="icon">
						<WrenchScrewdriver />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Profile" href="/my/profile">
					<svelte:fragment slot="icon">
						<UserCircle />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Help" class="opacity-20 hover:bg-transparent cursor-default">
					<svelte:fragment slot="icon">
						<Lifebuoy />
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup></svelte:fragment
		>
	</Sidebar>

	<MainContent>
		<div class="p-8 bg-slate-100 bg-[url('/bg.png')] bg-cover min-h-screen overflow-auto">
			<slot />
		</div>
	</MainContent>
</UIShell>
