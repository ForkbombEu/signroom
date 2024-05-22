<script lang="ts" context="module">
	export type SidebarLayoutMode = 'default' | 'drawer';
</script>

<script lang="ts">
	import { getUIShellContext } from './UiShell.svelte';
	import SidebarDefaultContainer from './SidebarDefaultContainer.svelte';
	import SidebarDrawerContainer from './SidebarDrawerContainer.svelte';
	import { Sidebar } from 'flowbite-svelte';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';

	const { sidebarLayoutMode } = getUIShellContext();

	export let width = 'w-60';
	export let darkMode = false;
	export let preloadLinkOnHover = false;

	$: comp = $sidebarLayoutMode == 'drawer' ? SidebarDrawerContainer : SidebarDefaultContainer;
	$: activeUrl = i18n.route($page.url.pathname);
</script>

<svelte:component this={comp} {width} {darkMode}>
	<Sidebar
		{activeUrl}
		class="flex flex-col grow bg-white dark:bg-gray-800 border-r border-r-600"
		asideClass={width}
	>
		<div
			class="flex flex-col overflow-hidden grow"
			data-sveltekit-preload-data={preloadLinkOnHover ? 'hover' : 'false'}
		>
			{#if $sidebarLayoutMode == 'drawer'}
				<div class="shrink-0">
					<slot name="top" />
				</div>
			{/if}

			<div class="h-0 grow overflow-y-auto">
				<slot />
			</div>

			<div class="shrink-0 border-t dark:border-t-gray-700 p-3">
				<slot name="bottom" />
			</div>
		</div>
	</Sidebar>
</svelte:component>
