<script lang="ts">
	import UserData from './_partials/userData.svelte';
	import UserKeys from './_partials/userKeys.svelte';
	import { Card } from 'flowbite-svelte';
	import { featureFlags } from '$lib/features';
</script>

<div class="max-w-xl mx-auto space-y-8 p-8">
	<Card class="!max-w-none">
		<UserData />
	</Card>
	{#if $featureFlags.KEYPAIROOM}
		<Card class="!max-w-none">
			<UserKeys />
		</Card>
	{/if}
</div>
