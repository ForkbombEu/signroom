<script lang="ts">
	import type { PBRecord, PBResponse } from '$lib/utils/types';
	type RecordGeneric = $$Generic<PBRecord>;

	export let value: unknown;
</script>

<div class="bg-gray-200 w-fit py-1 px-2 rounded-full text-xs">
	{value}
</div>
