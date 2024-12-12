<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { m } from '$lib/i18n';
	import type { TemplatesRecord } from '$lib/pocketbase/types';
	import { getTemplatePropertyList } from './utils';

	export let template: TemplatesRecord;

	let propertyList = getTemplatePropertyList([template.schema]);
</script>

<p class="mt-2 w-fit rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
	{#if Boolean(propertyList)}
		{m.Properties()}: {propertyList}
	{:else}
		{m.No_properties_found()}
	{/if}
</p>
