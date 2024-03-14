<script lang="ts">
	import type { OrgJoinRequestsResponse, UsersResponse } from '$lib/pocketbase/types';
	import { Avatar } from 'flowbite-svelte';

	export let value: any;
	export let record: OrgJoinRequestsResponse<{ user: UsersResponse }>;
	value;
	const { emailVisibility, name, email, avatar } = record.expand!.user;
</script>

<div class="flex items-center gap-2">
	<Avatar size="sm" src={avatar} />
	<div class="flex flex-col">
		<p>{name}</p>
		{#if emailVisibility}
			<p>{email}</p>
		{/if}
	</div>
</div>
