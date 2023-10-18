<script lang="ts">
	import { JSONSchemaBuilder, type JSONSchema } from 'json-schema-builder-svelte';

	let result: JSONSchema | undefined;
</script>

<JSONSchemaBuilder
	on:create={(e) => {
		result = e.detail.schema;
	}}
/>

{#if result}
	<pre class="">{JSON.stringify(result, null, 2)}</pre>
{/if}
