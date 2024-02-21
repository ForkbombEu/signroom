import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { goto as sveltekitGoto } from '$app/navigation';

import * as m from '$paraglide/messages';
import * as runtime from '$paraglide/runtime';

//

export const i18n = createI18n(runtime);

export const resolveRoute = (route: string, currentUrl: URL) =>
	i18n.resolveRoute(route, i18n.getLanguageFromUrl(currentUrl));

export const goto = (route: string) => sveltekitGoto(resolveRoute(route, get(page).url));

export { m };
