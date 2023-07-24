<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { formHasErrors, getFormContext } from './form.svelte';
	import type { ButtonColorType } from 'flowbite-svelte/dist/types';

	export let id = 'submit';
	export let color: ButtonColorType = 'primary';

	const { superform } = getFormContext();
	const { allErrors } = superform;

	$: hasErrors = formHasErrors($allErrors);
</script>

<Button {id} {color} type="submit" disabled={hasErrors}>
	<slot />
</Button>
