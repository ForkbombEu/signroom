<script>
	import { Logo, Topbar } from '$lib/layout';
	import { currentUser } from '$lib/pocketbase';
	import DIDButton from '$lib/components/DIDButton.svelte';
	import UserAvatar from '$lib/components/userAvatar.svelte';
	import { m } from '$lib/i18n';
</script>

<Topbar>
	<Logo slot="left" />
	<div class="flex items-center" slot="center">
		<div>
			<span class="whitespace-nowrap">
				{m.Hello()} <span class="font-semibold">{$currentUser?.email}</span>
			</span>
		</div>
		<div class="shrink-0">
			<DIDButton />
		</div>
	</div>
	<UserAvatar slot="right" />
</Topbar>

<slot></slot>
