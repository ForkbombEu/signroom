<script lang="ts">
	import type { Record } from 'pocketbase';
	import type {
	CrudExampleRecord,
	} from '$lib/pocketbase-types';
	import type { PBResponse } from '$lib/utils/types';


	export let value: unknown;
	type RecordGeneric = $$Generic<PBRecord>;
	export let record:PBResponse<RecordGeneric>;
	record;
</script>

<div class="bg-gray-200 w-fit py-1 px-2 rounded-full text-xs">
	{value}
</div>
