<script lang="ts" context="module">
	import type { IconComponent } from '$lib/utils/types';

	type BadgeColor = ComponentProps<Badge>['color'];

	export interface SidebarLink {
		label: string;
		disabled?: boolean;
		href?: string;
		icon?: IconComponent;
		subLinks?: SidebarLink[];
		badge?: {
			text: string;
			color: BadgeColor;
		};
	}
</script>

<script lang="ts">
	import {
		Badge,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem
	} from 'flowbite-svelte';
	import { getUIShellContext } from './UIShell.svelte';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/stores';

	export let links: SidebarLink[];

	const { toggleSidebar, sidebarLayoutMode } = getUIShellContext();

	const toggleSidebarHandler = () => {
		if ($sidebarLayoutMode == 'drawer') {
			toggleSidebar();
		}
	};
	export let activeClass = "flex items-center p-2 pl-11 text-base font-normal text-gray-900 bg-gray-200 dark:bg-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
</script>

<div class="p-3">
	<SidebarGroup>
		{#each links as entry}
			{#if entry.subLinks && entry.subLinks.length > 0}
				<SidebarDropdownWrapper label={entry.label}>
					<svelte:fragment slot="icon">
						<svelte:component this={entry.icon} />
					</svelte:fragment>
					{#each entry.subLinks as subEntry}
						<SidebarDropdownItem
							label={subEntry.label}
							href={subEntry.href}
							on:click={() => toggleSidebarHandler()}
							active={$page.url.pathname === subEntry.href}
							{activeClass}
						/>
					{/each}
				</SidebarDropdownWrapper>
			{:else}
				<SidebarItem label={entry.label} href={entry.href} on:click={() => toggleSidebarHandler()}>
					<svelte:fragment slot="icon">
						<svelte:component this={entry.icon} />
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						{#if entry.badge}
							<Badge color={entry.badge.color}>{entry.badge.text}</Badge>
						{/if}
					</svelte:fragment>
				</SidebarItem>
			{/if}
		{/each}
	</SidebarGroup>
</div>
