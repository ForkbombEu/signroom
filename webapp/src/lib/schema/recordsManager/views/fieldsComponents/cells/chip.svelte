<script lang="ts">
	import clsx from 'clsx';
	import type { Record } from 'pocketbase';

	export let value: unknown;
	export let record: Record;
	let cl = clsx(
		{
			'bg-purple-100 text-purple-800': value === 'xades',
			'bg-pink-100 text-pink-800': value === 'pades',
			'bg-green-100 text-grern-800': value === 'jades',
			'bg-blue-100 text-blue-800': value === 'cades'
		},
		'px-3 w-fit  py-1 rounded uppercase'
	);
</script>

<div class={cl}>
	{value}
</div>
