<script lang="ts">
	export let value = '';
    import dayjs from 'dayjs';
    let formatted = dayjs(value).format('MMM DD,YYYY');
</script>

<div class="text-gray-500 text-md">
	{formatted}
</div>
