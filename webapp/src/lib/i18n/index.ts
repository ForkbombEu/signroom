import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';
import * as runtime from '$paraglide/runtime.js';
import * as m from '$paraglide/messages';

export const i18n = createI18n(runtime);

export { m, runtime };
