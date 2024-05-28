<script lang="ts">
	import clsx from 'clsx';
	import type { PBResponse } from '$lib/utils/types';

	type RecordGeneric = $$Generic<PBResponse>;

	export let value: unknown;
	export let record: RecordGeneric;
	record; // avoid 'unused' warning

	let cl = clsx({
		purple: value === 'xades',
		pink: value === 'pades',
		green: value === 'jades',
		yellow: value === 'cades'
	}) as 'purple' | 'pink' | 'green' | 'yellow';
</script>

<span class={`bg-${cl}-100 text-${cl}-800 mr-2 rounded px-2.5 py-0.5 text-xs font-medium`}>
	{value}
</span>
