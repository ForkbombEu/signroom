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

	export let links: SidebarItemProps[];

	const { toggleSidebar, sidebarLayoutMode } = getUIShellContext();

	const toggleSidebarHandler = () => {
		if ($sidebarLayoutMode == 'drawer') {
			toggleSidebar();
		}
	};
	const disabledClass = (disabled?: boolean) =>
		disabled ? 'opacity-20 hover:bg-transparent cursor-default pointer-events-none' : undefined;
	export let activeClass =
		'flex items-center p-2 pl-11 text-base font-normal text-gray-900 bg-gray-200 dark:bg-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700';

	function isDropdownOpen(sidebarGroup: SidebarGroupProps, page: Page) {
		return sidebarGroup.subLinks.map((l) => l.href).some((l) => page.url.pathname.includes(l));
	}
</script>

{#each links as entry}
	{#if 'subLinks' in entry}
		{@const isOpen = isDropdownOpen(entry, $page)}
		<SidebarDropdownWrapper
			label={entry.text}
			disabled={entry.disabled}
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
					active={$page.url.pathname === subEntry.href}
					{activeClass}
					disabled={subEntry.disabled}
					class={disabledClass(subEntry.disabled)}
				/>
			{/each}
		</SidebarDropdownWrapper>
	{:else}
		<SidebarItem
			label={entry.text}
			href={entry.href}
			disabled={entry.disabled}
			on:click={() => toggleSidebarHandler()}
			class={disabledClass(entry.disabled)}
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
