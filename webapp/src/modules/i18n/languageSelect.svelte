<script lang="ts">
	import { page } from '$app/stores';
	import { languagesData, m } from '.';
	import { Languages } from 'lucide-svelte';
	import Icon from '@/components/custom/icon.svelte';
	import * as Popover from '@/components/ui/popover';
	import { Button } from '@/components/ui/button';
	import { languageTag } from '.';

	const languages = languagesData($page);
	$: currentLanguage = languages.find((l) => l.tag == languageTag())!;
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<slot
			name="trigger"
			{builder}
			icon={Languages}
			text={m.Select_language()}
			language={currentLanguage}
		>
			<Button variant="outline" builders={[builder]}>
				<Icon src={Languages} mr />{m.Select_language()}
			</Button>
		</slot>
	</Popover.Trigger>

	<Popover.Content class="p-2" sameWidth>
		{#each languages as language}
			{@const { href, hreflang, name, flag, isCurrent } = language}
			<slot name="language" {language}>
				<Button
					{href}
					{hreflang}
					variant={isCurrent ? 'secondary' : 'ghost'}
					class="flex items-center justify-start gap-2"
				>
					<span class="text-2xl">
						{flag}
					</span>
					<span>
						{name}
					</span>
				</Button>
			</slot>
		{/each}
	</Popover.Content>
</Popover.Root>
