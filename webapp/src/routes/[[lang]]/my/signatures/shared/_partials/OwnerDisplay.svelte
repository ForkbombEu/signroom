<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { getUserDisplayName } from '$lib/utils/pb';
	import UserAvatar from '$lib/components/userAvatar.svelte';

	export let userId: string;

	function getUser(userId: string) {
		return pb.collection('users').getOne(userId);
	}
</script>

{#await getUser(userId) then user}
	<div class="flex items-center gap-2">
		<UserAvatar {user} size="xs" />

		<p>{getUserDisplayName(user)}</p>
	</div>
{/await}
