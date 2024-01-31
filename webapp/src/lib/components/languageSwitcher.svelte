<script lang="ts">
	import {
		setLanguageTag,
		availableLanguageTags,
		type AvailableLanguageTag,
		languageTag
	} from '$paraglide/runtime';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';

	const languageEmojis: Record<AvailableLanguageTag, string> = {
		en: '🇬🇧',
		it: '🇮🇹'
	};
</script>

<div>
	<Button>{languageEmojis[languageTag()]}</Button>
	<Dropdown>
		{#each availableLanguageTags as tag}
			<DropdownItem
				on:click={() => {
					setLanguageTag(tag);
					console.log(languageTag());
				}}
			>
				<p class="text-xl">
					{languageEmojis[tag]}
				</p>
			</DropdownItem>
		{/each}
	</Dropdown>
</div>
