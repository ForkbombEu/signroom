<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.postcss';

	import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit';
	import { i18n } from '$lib/i18n';
</script>

<ParaglideJS {i18n}>
	<slot />
</ParaglideJS>
