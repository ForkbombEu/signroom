<script lang="ts">
	import { page } from '$app/stores';
	import { i18n } from '$lib/i18n';
	import {
		availableLanguageTags,
		type AvailableLanguageTag,
		languageTag
	} from '$paraglide/runtime';

	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';

	//

	const languageEmojis: Record<AvailableLanguageTag, string> = {
		en: '🇬🇧',
		it: '🇮🇹'
	};
</script>

<div>
	<Button color="alternative" class="h-10 w-10 p-0">
		<span class="text-3xl">{languageEmojis[languageTag()]}</span>
	</Button>
	<Dropdown>
		{#each availableLanguageTags as lang}
			<DropdownItem>
				<a class="text-3xl" href={i18n.route($page.url.pathname)} hreflang={lang}>
					{languageEmojis[lang]}
				</a>
			</DropdownItem>
		{/each}
	</Dropdown>
</div>
