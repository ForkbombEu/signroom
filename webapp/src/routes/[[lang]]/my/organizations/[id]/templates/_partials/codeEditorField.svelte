<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import CodeEditor from '$lib/components/codeEditor.svelte';
	import type { ComponentProps } from 'svelte';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { UnwrapEffects } from 'sveltekit-superforms';
	import { FieldWrapper } from '$lib/forms';

	type T = $$Generic<AnyZodObject>;

	export let field: string;
	export let label = '';
	export let superform: SuperForm<UnwrapEffects<T>, any>;
	export let lang: ComponentProps<CodeEditor>['lang'];

	const { value } = formFieldProxy(superform, field);
</script>

<FieldWrapper {field} {label}>
	<CodeEditor bind:code={$value} {lang}></CodeEditor>
</FieldWrapper>

<style>
	:global(label[for*='required']) {
		display: flex !important;
		align-items: center;
		gap: 6px;
	}
</style>
