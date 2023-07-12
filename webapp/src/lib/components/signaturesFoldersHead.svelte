<script lang="ts">
	import { ArrowLeft, Folder } from 'svelte-heros-v2';
	import { pb } from '$lib/pocketbase';
	import { Collections, type FoldersRecord } from '$lib/pocketbase-types';

	import { Heading, Spinner, A } from 'flowbite-svelte';
	import type { Record } from 'pocketbase';

	//

	export let folderId: string;

	let folderPromise = loadFolder();

	async function loadFolder() {
		return await pb.collection(Collections.Folders).getOne<FoldersRecord & Record>(folderId);
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
