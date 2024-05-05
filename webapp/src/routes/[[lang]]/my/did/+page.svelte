<script lang="ts">
	import { Heading } from 'flowbite-svelte';
<<<<<<< ours
	import { m } from '$lib/i18n';
=======
>>>>>>> theirs

	export let data;
	const did = JSON.stringify(data.did, null, 2);
</script>

<div class="p-4 space-y-4">
<<<<<<< ours
	<Heading tag="h3">{m.Your_DID()}</Heading>
=======
	<Heading tag="h3">Your DID</Heading>
>>>>>>> theirs
	<pre class="bg-white p-4 border border-slate-200 rounded-lg">{did}</pre>
</div>
