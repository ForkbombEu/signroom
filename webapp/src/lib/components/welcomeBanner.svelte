<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script>
	import { m } from '$lib/i18n';
	import { appTitle } from '$lib/strings';
	import { Alert, Heading } from 'flowbite-svelte';

	let className = '';
	export { className as class };
</script>

<Alert color="yellow" border class="space-y-3 {className}">
	<Heading color="yellow" tag="h2" class="-rotate-2 text-ellipsis text-balance text-center">
		{m.welcome_to_app({ appName: appTitle })}
	</Heading>

	<slot />
</Alert>
