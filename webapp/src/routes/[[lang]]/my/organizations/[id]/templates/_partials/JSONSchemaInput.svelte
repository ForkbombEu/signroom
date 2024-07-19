<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import { JSONSchemaEditor } from 'json-schema-builder-svelte';
	import type { UnwrapEffects } from 'sveltekit-superforms';

	type T = $$Generic<AnyZodObject>;

	export let field: string;
	export let label = '';
	export let superform: SuperForm<UnwrapEffects<T>, any>;

	const { value } = formFieldProxy(superform, field);
</script>

<JSONSchemaEditor
	{label}
	bind:schema={$value}
	mode="builder"
	returnType="string"
	requiredDefault
	hideRequired
/>

<style>
	:global(label[for*='required']) {
		display: flex !important;
		align-items: center;
		gap: 6px;
	}
</style>
