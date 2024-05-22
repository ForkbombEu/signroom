<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import { Avatar } from 'flowbite-svelte';
	import BoringAvatar from 'svelte-boring-avatars';
	import type { UsersResponse } from '$lib/pocketbase/types';

	//

	const sizeToNumber = {
		xs: 24, // to be defined
		sm: 32, // to be defined
		md: 40,
		lg: 80,
		xl: 98 // to be defined
	};

	//

	export let user: UsersResponse | undefined | null = $currentUser;
	export let size: keyof typeof sizeToNumber = 'md';

	//@ts-ignore
	$: src = pb.files.getUrl(user, user?.avatar);
</script>

<div class="shrink-0">
	{#if $currentUser?.avatar}
		<Avatar {size} {src} />
	{:else}
		<BoringAvatar variant="beam" size={sizeToNumber[size]} name={$currentUser?.email} />
	{/if}
</div>
