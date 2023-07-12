<script lang="ts">
	import { pb } from "$lib/pocketbase";

    export let folderId: string;
    let folder: string;
    pb.collection('folders').getOne(folderId).then((res) => {
        folder = res.name;
    })
</script>

<div class="text-gray-400 font-semibold">{folder}/</div>