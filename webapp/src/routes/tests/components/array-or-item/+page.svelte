<script lang="ts">
	import ArrayOrItemManager from '@/components/custom/arrayOrItemManager.svelte';
	import PlainCard from '@/components/custom/plainCard.svelte';
	import Button from '@/components/ui/button/button.svelte';

	let items = ['ciao', 'no', 'ok'];

	let item: string | undefined = 'ok';
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Array test</h1>

<ArrayOrItemManager bind:data={items} let:item let:removeItem>
	<PlainCard class="flex items-center justify-between">
		<p>{item}</p>
		<Button on:click={removeItem}>ok</Button>
	</PlainCard>
</ArrayOrItemManager>

<pre>{JSON.stringify(items)}</pre>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Item test</h1>

<ArrayOrItemManager bind:data={item} let:item let:removeItem>
	<PlainCard class="flex items-center justify-between">
		<p>{item}</p>
		<Button on:click={removeItem}>ok</Button>
	</PlainCard>
</ArrayOrItemManager>

<pre>{JSON.stringify(item)}</pre>
