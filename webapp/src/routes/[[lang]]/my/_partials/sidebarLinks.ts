import type { m } from '$lib/i18n';
import type { SidebarLink } from '$lib/layout';
import { pb } from '$lib/pocketbase';
import { ClipboardDocumentCheck } from 'svelte-heros';
import { RocketLaunch, InboxArrowDown, Identification, Wallet } from 'svelte-heros-v2';

const didUrl = `https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:${pb.authStore.model?.eddsa_public_key}`;

export function createSidebarLinks(messages: typeof m): SidebarLink[] {
	const m = messages

	return[
	{
		label: m.start(),
		href: '/my',
		icon: RocketLaunch
	},
	{
		label: m.signatures(),
		icon: ClipboardDocumentCheck,
		subLinks: [
			{
				label: m.my_folders(),
				href: '/my/folders'
			},
			{
				label: m.my_signatures(),
				href: '/my/signatures'
			},
			{
				label: m.validate_signatures(),
				href: '/my/validate'
			},
			{
				label: m.multisignatures(),
				disabled: true,
				href: '/'
			}
		]
	},
	{
		label: m.notifications(),
		icon: InboxArrowDown,
		disabled: true
	},
	{
		label: m.identity(),
		icon: Identification,
		subLinks: [
			{
				label: m.my_DID(),
				href: didUrl
			},
			{ label: m.my_verifiable_credentials(), disabled: true, href: '/' }
		]
	},
	{
		label: m.organizations(),
		icon: Wallet,
		href: '/my/organizations'
	}
]}
