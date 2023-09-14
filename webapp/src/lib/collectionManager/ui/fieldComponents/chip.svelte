<script lang="ts">
	import clsx from 'clsx';
	import { Badge } from 'flowbite-svelte';
	import type { Record } from 'pocketbase';

	type RecordGeneric = $$Generic;

	export let value: unknown;
	export let record: Record & RecordGeneric;
	record; // avoid 'unused' warning

	let cl = clsx(
		{
			'purple': value === 'xades',
			'pink': value === 'pades',
			'green': value === 'jades',
			'yellow': value === 'cades'
		}
	) as 'purple' | 'pink' | 'green' | 'yellow';
</script>

<Badge color={cl}>
	{value}
</Badge>
