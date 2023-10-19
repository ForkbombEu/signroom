<script lang="ts">
	import {
		JSONSchemaBuilder,
		type JSONSchema,
		createJSONSchemaInput
	} from 'json-schema-builder-svelte';

	let result: JSONSchema | undefined;
</script>

<JSONSchemaBuilder
	schemaInput={createJSONSchemaInput()}
	on:create={(e) => {
		result = e.detail.schema;
	}}
/>

{#if result}
	<pre class="">{JSON.stringify(result, null, 2)}</pre>
{/if}
