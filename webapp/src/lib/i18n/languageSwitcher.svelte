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

<SidebarDropdownWrapper label={languagesDisplay[languageTag()].name} ulClass="hidden" {id}>
	<svelte:fragment slot="icon">
		<p class="w-6 h-6 text-2xl leading-[1]">{languagesDisplay[languageTag()].flag}</p>
	</svelte:fragment>

	<svelte:fragment slot="arrowdown">
		<Icon src={ArrowPath} class="mr-1"></Icon>
	</svelte:fragment>
	<svelte:fragment slot="arrowup">
		<Icon src={ArrowPath} class="mr-1"></Icon>
	</svelte:fragment>
</SidebarDropdownWrapper>

<Dropdown triggeredBy={`#${id}`} class="w-[215px]">
	<DropdownHeader>
		<span class="block truncate text-xs font-medium text-gray-500 tracking-wide">
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
