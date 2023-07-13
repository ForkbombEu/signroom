<script lang="ts">
	import { page } from '$app/stores';
	import { currentUser } from '$lib/pocketbase';
	import { appTitle } from '$lib/strings';
	import {
		Button,
		CloseButton,
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		NavBrand,
		NavHamburger,
		Navbar,
		Sidebar,
		SidebarCta,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import {
		RocketLaunch,
		ClipboardDocumentCheck,
		Fire,
		Identification,
		InboxArrowDown,
		Lifebuoy,
		UserCircle,
		Wallet,
		WrenchScrewdriver
	} from 'svelte-heros-v2';
	import '../../app.postcss';
	import FeatureFlag from '$lib/components/featureFlag.svelte';
	import UserAvatar from '$lib/components/userAvatar.svelte';

	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
	$: activeUrl = $page.url.pathname;
</script>

<div class="w-screen h-screen overflow-hidden flex flex-col">
	<div class="shrink-0">
		<Navbar let:hidden let:toggle fluid={true}>
			<NavBrand href="/my" class="w-64">
				<img src="/logo.svg" class="mr-3 h-6 sm:h-9" alt="{appTitle} Logo" />
				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
					>{appTitle}</span
				>
			</NavBrand>
			<div class="flex items-center md:order-2 hover:cursor-pointer">
				<button id="avatar-menu">
					<UserAvatar />
				</button>
				<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
			</div>
			<Dropdown placement="bottom" triggeredBy="#avatar-menu">
				<DropdownHeader>
					<span class="block truncate text-sm font-medium">{$currentUser?.email}</span>
				</DropdownHeader>
				<DropdownItem href="/my/profile">My profile</DropdownItem>
				<DropdownDivider />
				<DropdownItem href="/pro" class="flex items-center"
					><Fire class="text-red-500 mr-2 w-5" /> Go Pro</DropdownItem
				>
				<DropdownDivider />
				<DropdownItem href="/my/logout" class="text-primary-600">Sign out</DropdownItem>
			</Dropdown>
			<div>
				<span>Hello, <span class="font-semibold text-primary-600">{$currentUser?.email}</span></span
				>
				<FeatureFlag flag="DID">
					<Button
						href="https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:{$currentUser?.eddsa_public_key}"
						target="_blank"
						size="xs"
						class="ml-3"
						color="light">My DID</Button
					>
				</FeatureFlag>
			</div>
		</Navbar>
	</div>

	<div class="h-0 grow flex">
		<Sidebar class="!shrink-0 !overflow-auto">
			<SidebarWrapper class="min-h-screen flex flex-col justify-between">
				<SidebarGroup>
					<SidebarItem label="Start" href="/my">
						<svelte:fragment slot="icon">
							<RocketLaunch />
						</svelte:fragment>
					</SidebarItem>
					<SidebarDropdownWrapper label="Signatures">
						<svelte:fragment slot="icon">
							<ClipboardDocumentCheck />
						</svelte:fragment>
						<SidebarDropdownItem label="My folders" href="/my/folders" />
						<SidebarDropdownItem label="My signatures" href="/my/signatures" />
						<SidebarDropdownItem label="Validate signature" href="/my/validate" />
						<SidebarDropdownItem
							class="opacity-20 hover:bg-transparent cursor-default"
							label="Multisignature"
						/>
						<SidebarDropdownItem
							class="opacity-20 hover:bg-transparent cursor-default"
							label="Zero Knowledge Proof"
						/>
					</SidebarDropdownWrapper>

					<SidebarItem
						label="Notifications"
						{spanClass}
						class="opacity-30 hover:bg-transparent cursor-default"
					>
						<svelte:fragment slot="icon">
							<InboxArrowDown />
						</svelte:fragment>
						<svelte:fragment slot="subtext">
							<span
								class="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200"
								>3</span
							>
						</svelte:fragment>
					</SidebarItem>
					<SidebarDropdownWrapper label="Identity">
						<svelte:fragment slot="icon">
							<Identification />
						</svelte:fragment>
						<FeatureFlag flag="DID">
							<SidebarDropdownItem
								label="My DID"
								href="https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:{$currentUser?.eddsa_public_key}"
								target="_blank"
							/>
						</FeatureFlag>
						<SidebarDropdownItem
							label="My Verifiable Credentials"
							class="opacity-20 hover:bg-transparent cursor-default"
						/>
					</SidebarDropdownWrapper>
					<SidebarDropdownWrapper
						label="Organization"
						class="opacity-30 hover:bg-transparent cursor-default"
					>
						<svelte:fragment slot="icon">
							<Wallet />
						</svelte:fragment>
						<SidebarDropdownItem label="Credential issuer" />
					</SidebarDropdownWrapper>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarCta label="Beta">
						<svelte:fragment slot="icon">
							<CloseButton data-collapse-toggle="dropdown-cta" />
						</svelte:fragment>
						<p class="mb-3 text-sm text-blue-900 dark:text-blue-400">
							Signroom is in beta! You can turn the new navigation off for a limited time in your
							profile.
						</p>
						<a
							class="text-sm text-blue-900 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
							href="/"
						>
							Turn new navigation off
						</a>
					</SidebarCta>
					<SidebarItem label="Settings">
						<svelte:fragment slot="icon">
							<WrenchScrewdriver />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Profile">
						<svelte:fragment slot="icon">
							<a href="/my/profile">
								<UserCircle />
							</a>
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Help">
						<svelte:fragment slot="icon">
							<Lifebuoy />
						</svelte:fragment>
					</SidebarItem>
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>

		<div class="w-0 grow p-8 bg-slate-100 bg-[url('/bg.png')] bg-cover overflow-auto">
			<div class="rounded-lg p-4 bg-white flex flex-col space gap-10 shadow-md">
				<slot />
			</div>
		</div>
	</div>
</div>
