<script>
	import UserCard from '$lib/components/userCard.svelte';
	import UserKeys from '$lib/components/userKeys.svelte';
</script>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-0 max-w- w-full">
	<div class="flex flex-col col-span-5">
		<UserCard />
	</div>
	<div class="flex flex-col col-span-7">
		<UserKeys />
	</div>
</div>
