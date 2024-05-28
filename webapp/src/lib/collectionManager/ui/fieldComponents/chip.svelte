<script lang="ts">
	import type { PBResponse } from '$lib/utils/types';
	type RecordGeneric = $$Generic<PBResponse>;

	export let value: unknown;
</script>

<div class="w-fit rounded-full bg-gray-200 px-2 py-1 text-xs">
	{value}
</div>
