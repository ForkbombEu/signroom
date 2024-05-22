<script lang="ts">
	import { nanoid } from 'nanoid';
	import { twMerge } from 'tailwind-merge';

	export let id = nanoid(5);

	let className = '';
	export { className as class };

	$: classes = twMerge(
		'flex items-center justify-between p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 gap-4',
		className
	);
</script>

<button {id} class={classes} on:click>
	<div class="flex items-center w-0 grow overflow-hidden">
		<slot />
	</div>
	<div>
		<slot name="right" />
	</div>
</button>
