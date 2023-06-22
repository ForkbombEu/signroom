<script lang="ts">
	import FeatureFlag from '$lib/components/featureFlag.svelte';
	import { features } from '$lib/features';
</script>

<div class="p-4 space-y-8">
	<h1>Features data</h1>
	{#each $features as feature}
		<div class="space-y-2">
			<p>Feature: {feature.name} | Active: {feature.active}</p>
			<div class="flex gap-4 items-stretch">
				<div class="font-mono w-0 grow bg-gray-200 overflow-x-auto p-4 rounded-lg">
					<pre>{JSON.stringify(feature.envVariables, null, 2)}</pre>
				</div>
				<div class="font-mono w-0 grow bg-gray-200 overflow-x-auto p-4 rounded-lg">
					<FeatureFlag flag={feature.name}>
						<div>
							This is feature {feature.name} and it is {feature.active ? 'active' : 'not active'}
						</div>
					</FeatureFlag>
					{#if !feature.active}
						<p class="text-gray-400">This feature is not active</p>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>
