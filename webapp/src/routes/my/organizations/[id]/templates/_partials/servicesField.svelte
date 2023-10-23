<script lang="ts">
	import type { ServicesResponse, TemplatesRecord } from '$lib/pocketbase/types';
	import type { PBResponse } from '$lib/utils/types';

	export let record: PBResponse<TemplatesRecord, { 'services(templates)': ServicesResponse[] }>;
</script>

{JSON.stringify(record)}
