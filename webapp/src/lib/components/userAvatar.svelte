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
	$: src = pb.files.getUrl($currentUser, user?.avatar);
</script>

{#if $currentUser?.avatar}
	<Avatar {size} {src} />
{:else}
	<BoringAvatar variant="beam" size={sizeToNumber[size || 'md']} name={$currentUser?.email} />
{/if}
