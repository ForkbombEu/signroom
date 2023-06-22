<script lang="ts">
	import { isFeatureActive, features } from '$lib/features';

	export let flag: string;
</script>

{#if isFeatureActive($features, flag)}
	<slot />
{/if}
