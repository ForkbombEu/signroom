import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { goto as sveltekitGoto } from '$app/navigation';
import { redirect as sveltekitRedirect } from '@sveltejs/kit';

import * as m from '$paraglide/messages';
import * as runtime from '$paraglide/runtime';
import { languageTag } from '$paraglide/runtime';

//

export const i18n = createI18n(runtime);
export { m };

//

export const resolveRoute = (route: string, currentUrl: URL) =>
	i18n.resolveRoute(route, i18n.getLanguageFromUrl(currentUrl));

export const goto = (route: string) => sveltekitGoto(resolveRoute(route, get(page).url));

type StatusCode = Parameters<typeof sveltekitRedirect>['0'];
type RedirectOptions = { statusCode: StatusCode };
export const redirect = (fromUrl: URL, toRoute: string, options: Partial<RedirectOptions> = {}) => {
	const { statusCode = 303 } = options;
	const hasLang = toRoute.includes('/' + languageTag() + '/');
	const toUrl = resolveRoute(toRoute, fromUrl);
	return sveltekitRedirect(statusCode, hasLang ? toRoute : toUrl);
};
