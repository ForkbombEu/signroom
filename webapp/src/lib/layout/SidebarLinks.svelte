<script lang="ts" context="module">
	import type { NavigationTabProps } from '$lib/components/navigationTab.svelte';
	import type { IconComponent, LinkWithIcon } from '$lib/utils/types';

	type BadgeColor = ComponentProps<Badge>['color'];

	interface SidebarLinkOptions {
		badge?: {
			text: string;
			color: BadgeColor;
		};
		disabled?: boolean;
	}

	export interface SidebarLinkProps extends NavigationTabProps, SidebarLinkOptions {}

	export interface SidebarGroupProps extends SidebarLinkOptions {
		text: string;
		icon?: IconComponent | string;
		subLinks: SidebarLinkProps[];
	}

	export type SidebarItemProps = SidebarGroupProps | SidebarLinkProps;
</script>

<script lang="ts">
	import {
		Avatar,
		Badge,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarItem
	} from 'flowbite-svelte';
	import { getUIShellContext } from './UiShell.svelte';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/stores';
	import type { Page } from '@sveltejs/kit';
	import clsx from 'clsx';

	export let links: SidebarItemProps[];

	const { toggleSidebar, sidebarLayoutMode } = getUIShellContext();

	const toggleSidebarHandler = () => {
		if ($sidebarLayoutMode == 'drawer') {
			toggleSidebar();
		}
	};

	function isDropdownOpen(sidebarGroup: SidebarGroupProps, page: Page) {
		return sidebarGroup.subLinks.map((l) => l.href).some((l) => page.url.pathname.includes(l));
	}

	function classes(disabled?: boolean) {
		return clsx({
			'opacity-20 hover:bg-transparent cursor-default pointer-events-none': disabled
		});
	}
</script>

{#each links as entry}
	{#if 'subLinks' in entry}
		{@const isOpen = isDropdownOpen(entry, $page)}
		<SidebarDropdownWrapper
			label={entry.text}
			ulClass={`${isOpen ? 'bg-gray-600 rounded-md' : ''} space-y-1 pt-2`}
			class={`${isOpen ? 'bg-gray-600' : ''} space-y-1`}
			{isOpen}
		>
			<svelte:fragment slot="icon">
				{#if typeof entry.icon == 'string'}
					<Avatar src={entry.icon} size="sm" class="ring-1 ring-gray-500" />
				{:else}
					<svelte:component this={entry.icon} />
				{/if}
			</svelte:fragment>

			{#each entry.subLinks as subEntry}
				<SidebarDropdownItem
					label={subEntry.text}
					href={subEntry.href}
					on:click={() => toggleSidebarHandler()}
					class={classes(subEntry.disabled)}
				/>
			{/each}
		</SidebarDropdownWrapper>
	{:else}
		<SidebarItem
			label={entry.text}
			href={entry.href}
			on:click={() => toggleSidebarHandler()}
			class={classes(entry.disabled)}
		>
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
