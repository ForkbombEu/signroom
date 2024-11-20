<script lang="ts">
	import type { AvatarProps } from 'bits-ui';
	import Avatar from './avatar.svelte';
	import type { UsersResponse } from '@/pocketbase/types';
	import { pb } from '@/pocketbase';
	import { m } from '@/i18n';

	type $$Props = AvatarProps & { user?: UsersResponse };
	export let user: $$Props['user'] = pb.authStore.model as UsersResponse;
	if (!user) throw new Error('missing user');

	$: src = pb.files.getUrl(user, user?.avatar);
	$: fallback = user.name.slice(0, 2);
</script>

<Avatar {...$$restProps} {src} {fallback} alt="{m.Avatar()} {user.name}" />
