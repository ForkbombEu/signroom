<script lang="ts">
    export let rows:{title:string, value:string}[]
</script>


<div class="flex flex-col">
    {#each rows as row}
        <div class="text-md text-black font-semibold max-w-sm">{row.title}</div>
        <div class=" mb-4 text-md font-bold border-t text-ellipsis overflow-hidden w-full">{row.value}</div>
    {/each}
</div>