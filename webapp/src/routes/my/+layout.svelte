<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

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
		SidebarCta,
		SidebarGroup,
		SidebarItem
	} from 'flowbite-svelte';
	import DIDButton from '$lib/components/DIDButton.svelte';
	import { Fire, Lifebuoy, UserCircle, WrenchScrewdriver } from 'svelte-heros-v2';

	import { links } from './sidebarLinks';

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
						Hello, <span class="font-semibold text-primary-600">{$currentUser?.email}</span>
					</span>
				</div>
				<div class="shrink-0">
					<DIDButton />
				</div>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="right">
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
		<SidebarLinks {links} />
		<svelte:fragment slot="bottom"
			><SidebarGroup class="px-2">
				<SidebarCta label="Beta">
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
				</SidebarCta>
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
		<div
			class="p-1 md:p-8 pt-20 bg-slate-100 bg-[url('/bg.png')] bg-cover min-h-screen overflow-auto"
		>
			<div class="rounded-lg p-2 md:p-4 bg-white flex flex-col space gap-10 shadow-md">
				<slot />
			</div>
		</div>
	</MainContent>
</UIShell>
