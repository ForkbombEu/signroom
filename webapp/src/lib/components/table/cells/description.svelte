<script lang="ts">
	import {log} from '$lib/utils/devLog';
	export let value:any
	export let record:any
	log(record)
</script>

<div class="line-clamp-3 w-64 whitespace-normal">
	{value}
</div>