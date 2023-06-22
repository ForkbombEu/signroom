<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Fileupload, Helper, Label, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';
	import { log } from 'debug';

	export let field: string;
	export let label = '';
	export let constraints = {};

	const { superform } = getFormContext();
	const { value, errors } = formFieldProxy(superform, field);

	let files: FileList | undefined;
	$: if (files) $value = [...files];
</script>

<div class="space-y-2">
	<Label color={'gray'} for={field} class="mb-2">{label}</Label>
	<!-- <Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">{label}</Label> -->
	<Fileupload name={field} bind:files {...constraints} data-invalid={$errors} />
	{#if files}
		<Listgroup items={[...files]} let:item class="mt-2">
			{#if item}
				{item.name}
			{:else}
				<ListgroupItem>No files</ListgroupItem>
			{/if}
		</Listgroup>
	{/if}
	<!-- {#if $errors}
		<Helper class="mt-2" color="red">{JSON.stringify($errors)}</Helper>
	{/if} -->
</div>
