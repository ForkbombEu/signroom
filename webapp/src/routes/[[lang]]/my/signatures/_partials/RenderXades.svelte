<script lang="ts">
	import xmlFormat from 'xml-formatter';
	export let file: string;
	let xml = atob(file);
</script>

<div class="h-max w-full overflow-x-scroll">
	<pre>{xmlFormat(xml)}</pre>
</div>
