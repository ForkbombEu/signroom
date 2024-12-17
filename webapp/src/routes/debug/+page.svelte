<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import debugInfo from '$lib/debug';
	import { String } from 'effect';

	const { submodule_status, zenroom_version } = debugInfo;

	const submodules_info = submodule_status
		.split('\n')
		.filter(String.isNonEmpty)
		.map(String.trim)
		.map(String.split(' '))
		.map((data) => ({
			path: data[1],
			commit: data[0],
			branch: data[2]
		}));

	const data = {
		debug_info: {
			zenroom_version,
			submodules_info
		}
	};
</script>

<div class="p-4">
	<div class="rounded-lg bg-slate-800 p-4 text-white">
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</div>
</div>
