<script lang="ts" context="module">
	import type { NavigationTabProps } from '$lib/components/navigationTab.svelte';
	import type { IconComponent } from '$lib/utils/types';

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
	import { Badge, SidebarDropdownItem, SidebarItem } from 'flowbite-svelte';
	import { getUIShellContext } from './UiShell.svelte';
	import type { ComponentProps } from 'svelte';

	import clsx from 'clsx';
	import SidebarLinksDropdown from './SidebarLinksDropdown.svelte';

	//

	export let links: SidebarItemProps[];

	//

	const { toggleSidebar, sidebarLayoutMode } = getUIShellContext();

	const toggleSidebarHandler = () => {
		if ($sidebarLayoutMode == 'drawer') {
			toggleSidebar();
		}
	};

	//

	function classes(disabled?: boolean) {
		return clsx({
			'opacity-20 hover:bg-transparent cursor-default pointer-events-none': disabled
		});
	}
</script>

{#each links as entry}
	{#if 'subLinks' in entry}
		<SidebarLinksDropdown props={entry} let:subEntry>
			<SidebarDropdownItem
				label={subEntry.text}
				href={subEntry.href}
				on:click={() => toggleSidebarHandler()}
				class={classes(subEntry.disabled)}
			/>
		</SidebarLinksDropdown>
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
