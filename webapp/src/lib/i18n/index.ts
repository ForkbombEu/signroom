import { createI18n } from "@inlang/paraglide-js-adapter-sveltekit"

import * as m from '$paraglide/messages'
import * as runtime from "$paraglide/runtime"

// 

export const i18n = createI18n(runtime)

export {m}