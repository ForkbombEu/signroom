<script lang="ts">
	import { Hr } from 'flowbite-svelte';
	export let file: string;
	let jadesArray = atob(file).split('.');
</script>

<div class="overflow-x-scroll w-full h-max">
	<pre>{JSON.stringify(
			JSON.parse(atob(jadesArray[0].replace(/_/g, '/').replace(/-/g, '+'))),
			null,
			2
		)}
		<!-- <Hr />{JSON.stringify(
					JSON.parse(atob(jadesArray[1].replace(/_/g, '/').replace(/-/g, '+'))),
					null,
					2
				)} -->
		<Hr />
	</pre>
	Signature: {jadesArray[2]}
</div>
