<script lang="ts">
	import { Alert } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';

	const { superform } = getFormContext();
	const { message, allErrors } = superform;

	$: error = $allErrors.at(0);
</script>

{#if error}
	<Alert color="red" dismissable>
		<p class="font-bold">Error</p>
		{#if error.messages.length > 0}
			<ul class="space-y-2 mt-1">
				{#each error.messages as message}
					<li class="leading-4">
						{message}
					</li>
				{/each}
			</ul>
		{/if}
	</Alert>
{/if}

{#if $message}
	<Alert color="red" dismissable>
		<p>{$message.message}</p>
		{#if $message.data && Object.keys($message.data).length > 0}
			<ul class="space-y-2 mt-2">
				{#each Object.entries($message.data) as [key, value]}
					<li class="leading-4">
						<span class="font-bold">{key}</span><br />{value.message}
					</li>
				{/each}
			</ul>
		{/if}
	</Alert>
{/if}
