<script lang="ts">
	import clsx from 'clsx';
	export let value = '';
	let cl = clsx(
		{
			'bg-purple-100 text-purple-800': value === 'json',
			'bg-pink-100 text-pink-800': value === 'pdf',
			'bg-green-100 text-grern-800': value === 'xml'
		},
		'px-3 w-fit  py-1 rounded uppercase'
	);
</script>

<div class={cl}>
	{value}
</div>