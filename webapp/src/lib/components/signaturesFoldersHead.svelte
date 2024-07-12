<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { ArrowLeft, Folder } from 'svelte-heros-v2';
	import { pb } from '$lib/pocketbase';

	import { Heading, Spinner, A } from 'flowbite-svelte';

	//

	export let folderId: string;

	let folderPromise = loadFolder();

	async function loadFolder() {
		return await pb.collection('folders').getOne(folderId);
	}
</script>

{#await folderPromise}
	<Spinner />
{:then folder}
	<div>
		<A href="/my/folders"><ArrowLeft size="20" /> <span class="ml-2">Back to folders</span></A>
		<div class="flex items-center gap-4">
			<Folder size="64" />
			<Heading tag="h3">{folder.name}</Heading>
		</div>
	</div>
{/await}
