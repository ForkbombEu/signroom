<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { formHasErrors, getFormContext } from './form.svelte';
	import type { ButtonProps } from 'flowbite-svelte/dist/buttons/Button.svelte';

	export let id = 'submit';
	export let color:ButtonProps["color"] = 'primary';

	const { superform } = getFormContext();
	const { allErrors } = superform;

	$: hasErrors = formHasErrors($allErrors);
</script>

<Button {id} {color} type="submit" disabled={hasErrors}>
	<slot />
</Button>
