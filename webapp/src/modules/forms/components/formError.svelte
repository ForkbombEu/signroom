<script lang="ts">
	import { getFormContext } from '@/forms';
	import { m } from '@/i18n';
	import { FORM_ERROR_PATH } from '../form';
	import Alert from '@/components/custom/alert.svelte';
	import { TriangleAlert } from 'lucide-svelte';

	const { form } = getFormContext();
	const { allErrors } = form;

	$: error = $allErrors.find((e) => e.path == FORM_ERROR_PATH);
</script>

{#if error}
	<Alert variant="destructive" icon={TriangleAlert} let:Title let:Description>
		<Title>{m.Error()}</Title>
		<Description>
			{#if error.messages.length > 0}
				{#each error.messages as message}
					{message}
				{/each}
			{/if}
		</Description>
	</Alert>
{/if}
