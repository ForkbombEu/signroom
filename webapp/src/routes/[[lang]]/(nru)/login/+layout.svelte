<script lang="ts" context="module">
	import { writable } from 'svelte/store';
<<<<<<< ours
	import { m } from '$lib/i18n';
=======
>>>>>>> theirs
	export const currentEmail = writable('');
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import type { Link } from '$lib/utils/types';
	import { A, Button, ButtonGroup, Heading, Hr, P } from 'flowbite-svelte';
	import { featureFlags } from '$lib/features';

	const modes: Link[] = [
		{
			href: '/login',
<<<<<<< ours
			text: m.Email_and_password()
		},
		{
			href: '/login/webauthn',
			text: m.Webauthn()
=======
			text: 'Email and password'
		},
		{
			href: '/login/webauthn',
			text: 'Webauthn'
>>>>>>> theirs
		}
	];
</script>

<<<<<<< ours
<Heading tag="h4">{m.Log_in()}</Heading>
{#if $featureFlags.WEBAUTHN}
	<div class="space-y-2">
		<P size="sm" color="text-gray-500">{m.Choose_your_authentication_method()}</P>
=======
<Heading tag="h4">Log in</Heading>
{#if $featureFlags.WEBAUTHN}
	<div class="space-y-2">
		<P size="sm" color="text-gray-500">Choose your authentication method</P>
>>>>>>> theirs
		<ButtonGroup class="w-full">
			{#each modes as { href, text }}
				{@const isActive = $page.url.pathname === href}
				<Button color={isActive ? 'dark' : 'alternative'} {href} class="grow">{text}</Button>
			{/each}
		</ButtonGroup>
	</div>
{/if}

<div class="pt-4">
	<slot />
</div>

<div class="flex flex-col items-center gap-4">
	<Hr />
	<P color="text-gray-500 dark:text-gray-400" size="sm">
<<<<<<< ours
		{m.Dont_have_an_account()}
		<A href="/register">{m.Register_here()}</A>
=======
		Don't have an account?
		<A href="/register">Register here</A>
>>>>>>> theirs
	</P>
</div>
