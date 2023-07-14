<script lang="ts">
	import { page } from '$app/stores';
	import { currentUser } from '$lib/pocketbase';
	import { appTitle } from '$lib/strings';
	import {
		Button,
		CloseButton,
		Drawer,
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
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
	import { sineIn } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
	$: activeUrl = $page.url.pathname;

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
	let breakPoint: number = 768;
	let width: number;
	let backdrop: boolean = false;
	let activateClickOutside = true;
	let drawerHidden: boolean = false;

	$: if (width >= breakPoint) {
		drawerHidden = false;
		activateClickOutside = false;
	} else {
		drawerHidden = true;
		activateClickOutside = true;
	}
	onMount(() => {
		if (width >= breakPoint) {
			drawerHidden = false;
			activateClickOutside = false;
		} else {
			drawerHidden = true;
			activateClickOutside = true;
		}
	});
	const toggleSide = () => {
		if (width < breakPoint) {
			console.log('toggleSide', drawerHidden);
			drawerHidden = !drawerHidden;
		}
	};
	$: if (width >= breakPoint) {
		drawerHidden = false;
		activateClickOutside = false;
	} else {
		drawerHidden = true;
		activateClickOutside = true;
	}
</script>

<svelte:window bind:innerWidth={width} />
<div class="w-screen h-screen overflow-hidden flex flex-col">
	<div class="shrink-0">
		<Navbar
			let:hidden
			let:toggle
			fluid={true}
			navClass="px-2 sm:px-4 py-2 md:py-0 fixed w-full z-20 top-0 left-0 border-b"
		>
			<NavHamburger on:click={toggleSide} class="!ml-0" />
			<NavBrand href="/my" class="w-64 md:block hidden">
				<img src="/logo.svg" class="mr-3 h-6 sm:h-9" alt="{appTitle} Logo" />
				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
					>{appTitle}</span
				>
			</NavBrand>
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
			<div class="flex items-center hover:cursor-pointer">
				<button id="avatar-menu">
					<UserAvatar />
				</button>
			</div>

			<Dropdown
				placement="bottom"
				triggeredBy="#avatar-menu"
				frameClass="w-full min-h-screen md:w-fit md:min-h-fit"
			>
				<DropdownHeader>
					<span class="block truncate text-sm font-medium">{$currentUser?.email}</span>
				</DropdownHeader>
				<DropdownItem href="/my/profile">My profile</DropdownItem>
				<DropdownDivider />
				<DropdownItem href="/pro" class="flex items-center"
					><Fire class="text-red-500 mr-2 w-5" /> Go Pro</DropdownItem
				>
				<DropdownDivider />
				<DropdownItem on:click={() => goto('/my/logout')} class="text-primary-600"
					>Sign out</DropdownItem
				>
			</Dropdown>
		</Navbar>
	</div>
	<div class="h-0 grow flex">
		<Drawer
			transitionType="fly"
			{backdrop}
			{transitionParams}
			bind:hidden={drawerHidden}
			bind:activateClickOutside
			width="w-fit"
			id="sidebar"
			divClass="overflow-hidden z-50 p-4 bg-white dark:bg-gray-800 w-fit fixed inset-y-0 left-0"
		>
			<div class="flex items-center mb-2">
				<NavBrand href="/my">
					<img src="/logo.svg" class="mr-3 h-6 sm:h-9" alt="{appTitle} Logo" />
					<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
						>{appTitle}</span
					>
				</NavBrand>
				<CloseButton on:click={() => (drawerHidden = true)} class=" dark:text-white md:hidden" />
			</div>
			<Sidebar>
				<SidebarWrapper class="min-h-screen pb-20 flex flex-col justify-between">
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
					</SidebarGroup>
				</SidebarWrapper>
			</Sidebar>
		</Drawer>

		<div
			class="p-1 md:p-8 pt-20 md:pt-32 bg-slate-100 grow bg-[url('/bg.png')] bg-cover md:ml-72 min-h-screen overflow-auto"
		>
			<div class="rounded-lg p-2 md:p-4 bg-white flex flex-col space gap-10 shadow-md">
				<slot />
			</div>
		</div>
	</div>
</div>
