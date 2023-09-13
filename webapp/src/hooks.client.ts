import * as Sentry from '@sentry/sveltekit';
import { currentUser, pb, type AuthStoreModel } from '$lib/pocketbase';

// If you don't want to use Session Replay, remove the `Replay` integration,
// `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options.
Sentry.init({
	dsn: 'https://f1256ba86cba40e094cf988b4ce32aae@o822807.ingest.sentry.io/4505521418338304',
	tracesSampleRate: 1,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1
});

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model as AuthStoreModel);
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
});

export const handleError = Sentry.handleErrorWithSentry();
