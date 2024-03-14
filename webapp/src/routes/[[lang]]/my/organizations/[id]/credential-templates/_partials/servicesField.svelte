<script lang="ts">
	import type { ServicesResponse, TemplatesResponse } from '$lib/pocketbase/types';

	export let record: TemplatesResponse<{ 'services(templates)': ServicesResponse[] }>;
</script>

{JSON.stringify(record)}
