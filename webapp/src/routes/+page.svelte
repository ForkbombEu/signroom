<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { currentUser } from '$lib/pocketbase';
	import { appTitle } from '$lib/strings';
	import {
		Button,
		Footer,
		FooterBrand,
		FooterCopyright,
		FooterIcon,
		FooterLink,
		FooterLinkGroup,
		Input,
		Label,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
		Span,
		Textarea
	} from 'flowbite-svelte';
	import {
		Contact,
		ContentWithImage,
		Facebook,
		FeatureDefault,
		FeatureItem,
		Github,
		HeroHeader,
		PricingBodyHead,
		PricingCard,
		PricingHead,
		PricingItem,
		PricingItemWrapper,
		Section,
		Twitter
	} from 'flowbite-svelte-blocks';
	import {
		AcademicCap,
		ArrowRight,
		Bolt,
		Briefcase,
		Cog,
		CurrencyDollar,
		PresentationChartLine
	} from 'svelte-heros-v2';
	let navClass = 'bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800';
	let navDivClass = 'flex flex-wrap justify-between items-center mx-auto max-w-screen-xl';
</script>

<div class="flex flex-col gap-20">
	<header>
		<Navbar let:hidden let:toggle fluid={false}>
			<NavBrand href="/">
				<img src="/logo.svg" class="mr-3 h-6 sm:h-9" alt={`${appTitle} Logo`} />
				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
					{appTitle}
				</span>
			</NavBrand>
			<div class="flex items-center lg:order-2">
				<a href="/login">Log In</a>
				<Button class="ml-4 mr-3 inline-flex items-center justify-center" href="/register">
					Register <ArrowRight size="18" class="-mr-1 ml-2" />
				</Button>
				<NavHamburger
					on:click={toggle}
					btnClass="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				/>
			</div>
			<NavUl
				{hidden}
				divClass="justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
				ulClass="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0"
				activeClass="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500"
				nonActiveClass="text-gray-500 hover:text-primary-700 dark:text-gray-400 dark:hover:text-primary-300"
			>
				<NavLi href="/" active={true}>Signatures</NavLi>
				<NavLi href="#contact">Contact</NavLi>
			</NavUl>
		</Navbar>
	</header>

	<Section>
		<HeroHeader
			h1Class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"
			pClass="max-w-2xl mb-6 font-light lg:mb-8 lg:text-3xl dark:text-gray-400"
		>
			<svelte:fragment slot="h1">
				Empower your
				<Span
					gradient
					gradientClass="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-500"
					class="text-primary-700">interoperable identity strategy</Span
				> with the DIDroom ecosystem.
			</svelte:fragment>
			<svelte:fragment slot="paragraph">Sign up and build your use case.</svelte:fragment>
			<a href="/">
				<Button class="mr-3 inline-flex items-center justify-center" href="/register">
					Register <ArrowRight size="18" class="-mr-1 ml-2" />
				</Button>
			</a>
			<a href="/">
				<Button color="light" class="inline-flex items-center justify-center">
					Speak to Sales
				</Button>
			</a>
		</HeroHeader>
	</Section>

	<Section name="feature">
		<HeroHeader
			class="mb-8 max-w-screen-md lg:mb-16"
			h2Class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
			pClass="text-gray-500 sm:text-xl dark:text-gray-400"
		>
			<svelte:fragment slot="h2">
				We are working for you! Come back soon or write us at <a href="mailto:info@forkbomb.eu"
					>info@forkbomb.eu</a
				>
			</svelte:fragment>
		</HeroHeader>
	</Section>

	<!-- svelte-ignore missing-declaration -->
</div>
