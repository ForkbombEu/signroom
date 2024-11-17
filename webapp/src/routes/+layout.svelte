<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import '@fontsource-variable/inter';
	import '../app.postcss';

	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';

	import { version } from '$app/environment';
	console.info(`SAAS version: 🔖 ${version}`);
</script>

<ParaglideJS {i18n}>
	<slot />
</ParaglideJS>

<Toaster richColors closeButton />
