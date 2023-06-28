<script lang="ts">
	let result: any;

	async function sign() {
		const response = await fetch('/api/sign');
		result = await response.json();
	}
</script>

<button on:click={sign}>gen the key</button>

<pre>
    {JSON.stringify(result, null, 2)}
</pre>
