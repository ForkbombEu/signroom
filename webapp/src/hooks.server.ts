import * as Sentry from '@sentry/sveltekit';
// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// file initialized by the Paraglide-SvelteKit CLI - Feel free to edit it
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';

Sentry.init({
	dsn: "https://f1256ba86cba40e094cf988b4ce32aae@o822807.ingest.us.sentry.io/4505521418338304",
	replaysSessionSampleRate: 1,
	replaysOnErrorSampleRate: 1
})

// add your own hooks as part of the sequence here
export const handle = sequence(Sentry.sentryHandle(), sequence(i18n.handle()));
export const handleError = Sentry.handleErrorWithSentry();
