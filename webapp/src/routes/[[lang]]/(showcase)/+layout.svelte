<script>
	import { appTitle } from '$lib/strings';
	import { Button, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import { ArrowRight } from 'svelte-heros-v2';
	import { m } from '$lib/i18n';
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
				<a href="/login">{m.Log_In()}</a>
				<Button class="ml-4 mr-3 inline-flex items-center justify-center" href="/register">
					{m.Register()}
					<ArrowRight size="18" class="-mr-1 ml-2" />
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
				<NavLi href="/" active={true}>{m.Signatures()}</NavLi>
				<NavLi href="#contact">{m.Contact()}</NavLi>
			</NavUl>
		</Navbar>
	</header>
	<slot />
</div>
