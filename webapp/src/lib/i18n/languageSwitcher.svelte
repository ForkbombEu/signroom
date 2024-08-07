<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import {
		availableLanguageTags,
		type AvailableLanguageTag,
		languageTag
	} from '$paraglide/runtime';
	import { page } from '$app/stores';
	import { i18n, m } from '.';
	import {
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		SidebarDropdownWrapper
	} from 'flowbite-svelte';
	import { ArrowPath } from 'svelte-heros-v2';
	import Icon from '$lib/components/icon.svelte';
	import SidebarButton from '$lib/layout/SidebarButton.svelte';

	const languagesDisplay: Record<AvailableLanguageTag, { flag: string; name: string }> = {
		en: { flag: '🇬🇧', name: 'English' },
		it: { flag: '🇮🇹', name: 'Italiano' },
		de: { flag: '🇩🇪', name: 'Deutsch' },
		fr: { flag: '🇫🇷', name: 'Français' },
		da: { flag: '🇩🇰', name: 'Dansk' },
		'pt-BR': { flag: '🇧🇷', name: 'Português' }
	};

	const id = 'language-switcher';
</script>

<SidebarButton {id}>
	<div class="flex gap-3">
		<p class="h-6 w-6 text-2xl leading-[1]">{languagesDisplay[languageTag()].flag}</p>
		<p>{languagesDisplay[languageTag()].name}</p>
	</div>
	<Icon src={ArrowPath} slot="right" size={18}></Icon>
</SidebarButton>

<Dropdown triggeredBy={`#${id}`} class="w-[215px]">
	<DropdownHeader>
		<span class="block truncate text-xs font-medium tracking-wide text-gray-500">
			{m.Select_language()}
		</span>
	</DropdownHeader>

	{#each availableLanguageTags as lang}
		<DropdownItem href={i18n.route($page.url.pathname)} hreflang={lang}>
			{languagesDisplay[lang].flag}
			&nbsp;
			{languagesDisplay[lang].name}
		</DropdownItem>
	{/each}
</Dropdown>
