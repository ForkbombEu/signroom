<script lang="ts">
	import xmlFormat from 'xml-formatter';
	export let file: string;
	let xml = atob(file);
</script>

<div class="overflow-x-scroll w-full h-max">
	<pre>{xmlFormat(xml)}</pre>
</div>
