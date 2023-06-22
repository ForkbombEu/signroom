<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import { getFormContext } from './form.svelte';

	export let field: string;

	const { superform } = getFormContext();
	const { value } = formFieldProxy(superform, field);
</script>

<input type="hidden" id={field} name={field} bind:value={$value} />
