<script context="module" lang="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { SidebarLayoutMode } from './Sidebar.svelte';

	export const UI_SHELL_KEY = Symbol('usk');

	export type UIShellContext = {
		isSidebarHidden: Writable<boolean>;
		toggleSidebar: () => void;
		sidebarLayoutMode: Writable<SidebarLayoutMode>;
	};

	export function getUIShellContext(): UIShellContext {
		return getContext(UI_SHELL_KEY);
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let sidebarLayoutBreakpoint: number | undefined = undefined;

	let windowWidth: number;

	const isSidebarHidden = writable(false);
	const sidebarLayoutMode = writable<SidebarLayoutMode>('default');

	$: if (sidebarLayoutBreakpoint && windowWidth && windowWidth >= sidebarLayoutBreakpoint) {
		$isSidebarHidden = false;
		$sidebarLayoutMode = 'default';
	} else {
		$isSidebarHidden = true;
		$sidebarLayoutMode = 'drawer';
	}

	const toggleSidebar = () => {
		if ($sidebarLayoutMode == 'drawer') {
			$isSidebarHidden = !$isSidebarHidden;
		}
	};

	setContext<UIShellContext>(UI_SHELL_KEY, {
		isSidebarHidden,
		toggleSidebar,
		sidebarLayoutMode
	});
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="flex h-screen w-screen flex-col overflow-hidden">
	<div class="shrink-0">
		<slot name="top" sidebarLayoutMode={$sidebarLayoutMode} {toggleSidebar} />
	</div>
	<div class="flex h-0 grow items-stretch">
		<slot sidebarLayoutMode={$sidebarLayoutMode} {toggleSidebar} />
	</div>
</div>
