<script lang="ts">
	import {
		availableLanguageTags,
		type AvailableLanguageTag,
		languageTag
	} from '$paraglide/runtime';
	import { page } from '$app/stores';
	import { i18n } from '.';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';

	const languageEmoji: Record<AvailableLanguageTag, string> = {
		en: '🇬🇧',
		it: '🇮🇹'
	};
</script>

<div>
	<Button color="alternative" class="w-10 h-10 p-0 text-2xl">{languageEmoji[languageTag()]}</Button>
	<Dropdown>
		{#each availableLanguageTags as lang}
			<DropdownItem>
				<a class="text-2xl" href={i18n.route($page.url.pathname)} hreflang={lang}>
					{languageEmoji[lang]}
				</a>
			</DropdownItem>
		{/each}
	</Dropdown>
</div>
