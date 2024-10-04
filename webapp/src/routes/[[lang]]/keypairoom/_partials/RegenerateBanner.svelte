<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script>
	import { m } from '$lib/i18n';
	import { Alert } from 'flowbite-svelte';
	import { ExclamationTriangle } from 'svelte-heros-v2';
</script>

<Alert color="yellow" border>
	<svelte:fragment slot="icon"><ExclamationTriangle /></svelte:fragment>
	<div class="space-y-1">
		<p>{m.You_have_been_redirected_here_because_your_private_keys_are_missing_()}</p>
		<p>{m.Before_using_the_app_again_you_need_to_restore_them_()}</p>
	</div>
</Alert>
