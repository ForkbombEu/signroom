<script lang="ts">
	import { formFieldProxy, type FormPath } from 'sveltekit-superforms';
	import { getFormContext } from '../form.svelte';
	import type { GenericRecord } from '@/utils/types';

	export let field: string;

	const { hideRequiredIndicator, form } = getFormContext();
	const { constraints } = formFieldProxy(form, field as FormPath<GenericRecord>);
	$: isFieldRequired = $constraints?.required;
</script>

{#if !hideRequiredIndicator && isFieldRequired}
	<span class="text-destructive ml-1 font-bold">*</span>
{/if}
