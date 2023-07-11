<script lang="ts">
	import TitleDescription from '$lib/components/titleDescription.svelte';
	import { Fileupload, Heading, P } from 'flowbite-svelte';
	import RenderSignedFile from '../signatures/_partials/RenderSignedFile.svelte.svelte';

	let file:any;
    let name: string;
	async function handleFileSelect(e: Event) {
		const fileUp = (e.target as HTMLInputElement)?.files;
		if (!fileUp) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                const json = JSON.parse(e.target?.result as string);
                console.log(json);
                file = json
                name = fileUp[0].name;
                console.log("pp", file, file.signedFile);
            } catch (error) {
                console.error(error);
            }
        }
        reader.readAsText(fileUp[0]);
	}
</script>

<div class="py-8 flex flex-col gap-8">
	<TitleDescription title="Validate" description="Upload a signature file and verify autenticity" />
	<Fileupload multiple={false} accept=".json" on:change={handleFileSelect} />
	{#if file}
		<P>{name}</P>
        <RenderSignedFile signedFile={file.signedFile} type={file.type} />
	{/if}
</div>
