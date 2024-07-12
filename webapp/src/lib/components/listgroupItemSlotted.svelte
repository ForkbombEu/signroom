<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { ListgroupItem } from 'flowbite-svelte';
</script>

<ListgroupItem class="!py-1 !pl-3 !pr-1">
	<div class="flex flex-nowrap items-center justify-between gap-4">
		<div class="w-0 grow overflow-hidden whitespace-nowrap">
			<slot name="left" />
		</div>
		<div class="flex items-center justify-end gap-1">
			<slot name="right" />
		</div>
	</div>
</ListgroupItem>
