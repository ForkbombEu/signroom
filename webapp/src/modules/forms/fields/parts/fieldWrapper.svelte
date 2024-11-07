<script lang="ts">
	import { capitalize } from 'effect/String';

	import * as Form from '@/components/ui/form';
	import type { FieldOptions } from '../types';
	import RequiredIndicator from '@/forms/components/requiredIndicator.svelte';

	export let field: string;
	export let options: Partial<FieldOptions> = {};
</script>

<Form.Control let:attrs>
	<Form.Label>
		{options.label ?? capitalize(field)}
		<RequiredIndicator {field} />
	</Form.Label>
	<slot {attrs} />
</Form.Control>

{#if options.description}
	<Form.Description>{options.description}</Form.Description>
{/if}

<Form.FieldErrors />
