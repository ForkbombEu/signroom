<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { getUIShellContext } from './UiShell.svelte';
	import { XMark } from 'svelte-heros-v2';

	const { isSidebarHidden } = getUIShellContext();
</script>

<Button color="alternative" class="!p-1.5" on:click={() => ($isSidebarHidden = true)}>
	<XMark size="24" />
</Button>
