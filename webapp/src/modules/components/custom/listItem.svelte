<script lang="ts">
	import { Button } from '@/components/ui/button';
	import Icon from '@/components/custom/icon.svelte';
	import { X } from 'lucide-svelte';
	import T from './t.svelte';

	export let label: string | undefined = undefined;
	export let hideButton = false;

	let className = '';
	export { className as class };
	export let contentClass = '';
</script>

<div class="flex items-center justify-between gap-6 px-1 py-1 pl-3 {className}">
	<div class="w-0 grow overflow-hidden {contentClass}">
		<slot>
			{#if label}
				<T tag="p">
					{label}
				</T>
			{/if}
		</slot>
	</div>

	{#if !hideButton}
		<Button variant="ghost" size="icon" class="size-8" on:click>
			<Icon src={X} size={20} />
		</Button>
	{/if}
</div>
