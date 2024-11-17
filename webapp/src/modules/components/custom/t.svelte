<script lang="ts">
	export let tag: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' = 'p';
	export let margin = false;

	let className: string | undefined = undefined;
	export { className as class };
</script>

{#if tag == 'h1'}
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl {className}">
		<slot />
	</h1>
{:else if tag == 'h2'}
	<h2
		class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 {className}"
	>
		<slot />
	</h2>
{:else if tag == 'h3'}
	<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight {className}"><slot /></h3>
{:else if tag == 'h4'}
	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight {className}"><slot /></h4>
{:else if tag == 'p'}
	<p class="{margin ? 'leading-7 [&:not(:first-child)]:mt-6' : ''} {className}"><slot /></p>
{:else if tag == 'small'}
	<small class="text-sm font-medium leading-none {className}"><slot /></small>
{/if}
