<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import type { ServicesResponse, TemplatesResponse } from '$lib/pocketbase/types';

	export let record: TemplatesResponse<{ 'services(templates)': ServicesResponse[] }>;
</script>

{JSON.stringify(record)}
