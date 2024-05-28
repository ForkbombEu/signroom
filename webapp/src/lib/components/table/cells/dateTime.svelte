<script lang="ts">
	export let value = '';
	import dayjs from 'dayjs';
	let formatted = dayjs(value).format('MMM DD,YYYY');
</script>

<div class="text-md text-gray-500">
	{formatted}
</div>
