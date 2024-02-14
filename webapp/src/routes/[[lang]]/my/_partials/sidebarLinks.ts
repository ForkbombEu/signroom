import type { m } from '$lib/i18n';
import type { SidebarLink } from '$lib/layout';
import { pb } from '$lib/pocketbase';
import { ClipboardDocumentCheck } from 'svelte-heros';
import { RocketLaunch, InboxArrowDown, Identification, Wallet } from 'svelte-heros-v2';

const didUrl = `https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:${pb.authStore.model?.eddsa_public_key}`;

export function createSidebarLinks(messages: typeof m): SidebarLink[] {
	const m = messages;

	return [
		{
			label: m.Start(),
			href: '/my',
			icon: RocketLaunch
		},
		{
			label: m.Signatures(),
			icon: ClipboardDocumentCheck,
			subLinks: [
				{
					label: m.My_folders(),
					href: '/my/folders'
				},
				{
					label: m.My_signatures(),
					href: '/my/signatures'
				},
				{
					label: m.Validate_signatures(),
					href: '/my/validate'
				},
				{
					label: m.Multisignatures(),
					disabled: true,
					href: '/'
				}
			]
		},
		{
			label: m.Notifications(),
			icon: InboxArrowDown,
			disabled: true
		},
		{
			label: m.identity(),
			icon: Identification,
			subLinks: [
				{
					label: m.My_DID(),
					href: didUrl
				},
				{ label: m.My_Verifiable_Credentials(), disabled: true, href: '/' }
			]
		},
		{
			label: m.organizations(),
			icon: Wallet,
			href: '/my/organizations'
		}
	];
}
