<script lang="ts">
	import type { OrgJoinRequestsRecord, UsersResponse } from '$lib/pocketbase/types';
	import type { PBResponse } from '$lib/utils/types';
	import { Avatar } from 'flowbite-svelte';

	export let value: any;
	export let record: PBResponse<
		OrgJoinRequestsRecord,
		{
			user: UsersResponse;
		}
	>;
	value;
	const { emailVisibility, username, email, avatar } = record.expand!.user;
</script>

<div class="flex items-center gap-2">
	<Avatar size="sm" src={avatar} />
	<div class="flex flex-col">
		<p>{username}</p>
		{#if emailVisibility}
			<p>{email}</p>
		{/if}
	</div>
</div>
