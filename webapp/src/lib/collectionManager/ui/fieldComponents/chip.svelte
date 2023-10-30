<script lang="ts">
	import type { PBResponse, PBRecord } from '$lib/utils/types';

	export let value: unknown;
	type RecordGeneric = $$Generic<PBRecord>;
	export let record: PBResponse<RecordGeneric>;
	record;
</script>

<div class="bg-gray-200 w-fit py-1 px-2 rounded-full text-xs">
	{value}
</div>
