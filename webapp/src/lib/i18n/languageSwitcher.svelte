<script lang="ts">
	import { availableLanguageTags } from '$paraglide/runtime';
	import { page } from '$app/stores';
	import { i18n } from '.';
</script>

{#each availableLanguageTags as lang}
	<a href={i18n.route($page.url.pathname)} hreflang={lang}>Change language to {lang}</a>
{/each}
