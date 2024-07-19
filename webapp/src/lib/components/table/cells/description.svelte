<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { log } from '$lib/utils/devLog';
	export let value: any;
	export let record: any;
	log(record);
</script>

<div class="line-clamp-3 w-full whitespace-normal">
	{value}
</div>
