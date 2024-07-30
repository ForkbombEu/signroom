<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import type { SidebarGroupProps } from './SidebarLinks.svelte';
	import { page } from '$app/stores';
	import { Avatar, SidebarDropdownWrapper } from 'flowbite-svelte';
	import clsx from 'clsx';

	export let props: SidebarGroupProps;

	//

	let isOpen = false;

	//

	$: isCurrent = isGroupCurrent(props, $page);
	$: if (isCurrent) isOpen = true;

	function isGroupCurrent(sidebarGroup: SidebarGroupProps, page: Page) {
		return sidebarGroup.subLinks.map((l) => l.href).some((l) => page.url.pathname.includes(l));
	}

	//

	$: ulClass = clsx('space-y-1 pt-2', {
		'bg-gray-600 rounded-md': isCurrent,
		'rounded-t-none': isOpen
	});

	$: baseClass = clsx({ 'bg-gray-600': isCurrent, 'rounded-b-none': isOpen }, 'space-y-1');
</script>

<SidebarDropdownWrapper label={props.text} {ulClass} class={baseClass} bind:isOpen>
	<svelte:fragment slot="icon">
		{#if typeof props.icon == 'string'}
			<!-- @ts-ignore -->
			<Avatar rounded="false" src={props.icon} size="sm" class="ring-1 ring-gray-500" />
		{:else}
			<svelte:component this={props.icon} />
		{/if}
	</svelte:fragment>

	{#each props.subLinks as subEntry}
		<slot {subEntry} />
	{/each}
</SidebarDropdownWrapper>
