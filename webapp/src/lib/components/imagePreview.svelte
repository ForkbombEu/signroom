<script lang="ts">
	import clsx from 'clsx';

	export let src: string | undefined = undefined;
	export let alt = 'Image preview';
	export let size = 'h-[70px] w-[70px]';
	export let hideHelpText = false;

	$: divClass = clsx(
		size,
		'rounded-full bg-gray-50 border border-gray-300 flex items-center justify-center text-gray-40',
		'overflow-hidden',
		'shrink-0'
	);

	function checkImageUrl(src: string) {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
			img.src = src;
		});
	}
</script>

<div class={divClass}>
	{#await checkImageUrl(src ?? '') then result}
		{#if result}
			<img class="h-full w-full object-cover" {src} {alt} />
		{:else}
			<div class="text-center text-xs leading-[0.9rem] text-gray-400">
				{#if !hideHelpText}
					<p>No</p>
					<p>Image</p>
				{/if}
			</div>
		{/if}
	{/await}
</div>
