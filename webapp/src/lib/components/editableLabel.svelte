<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { ArrowLeft, Pencil } from 'svelte-heros-v2';
	export let valueClass: string = '';
	export let value: string;
	export let handleChange: (value: string) => void;

	let isInputNameOpen = false;
	const handleSave = () => {
		handleChange(value);
		isInputNameOpen = false;
	};
</script>

<div class="flex w-full flex-row items-center justify-between">
	{#if !isInputNameOpen}
		<h5 class={`${valueClass}`}>
			{value}
		</h5>
		<Button on:click={() => (isInputNameOpen = true)} outline size="sm" class="w-14">
			<Pencil />
		</Button>
	{/if}

	{#if isInputNameOpen}
		<input
			type="text"
			bind:value
			class="mr-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:text-white"
		/>
		<div class="flex flex-row">
			<Button
				on:click={() => (isInputNameOpen = false)}
				outline
				size="sm"
				class="text-bold h-8 w-8 px-0"
			>
				<div class="flex flex-col">
					<ArrowLeft class="w-8" />
					<!-- <span class="text-sm font-bold">Back</span> -->
				</div>
			</Button>
			<Button on:click={handleSave} outline size="sm" class="h-8 w-8 px-0 text-red-500">
				<div class="flex flex-col">
					<Pencil class="w-8" />
					<!-- <span class="text-sm  font-bold">Save</span> -->
				</div>
			</Button>
		</div>
	{/if}
</div>
