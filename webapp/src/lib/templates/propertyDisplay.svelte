<script lang="ts">
	import { m } from '$lib/i18n';
	import type { TemplatesRecord } from '$lib/pocketbase/types';
	import { getTemplatePropertyList } from './utils';

	export let template: TemplatesRecord;

	let propertyList = getTemplatePropertyList([template.schema, template.schema_secondary]);
</script>

<p class="mt-2 w-fit rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
	{#if Boolean(propertyList)}
		{m.Properties()}: {propertyList}
	{:else}
		{m.No_properties_found()}
	{/if}
</p>
