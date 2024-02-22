import type { SidebarLink } from '$lib/layout';
import { pb } from '$lib/pocketbase';
import { ClipboardDocumentCheck } from 'svelte-heros';
import { RocketLaunch, InboxArrowDown, Identification, Wallet } from 'svelte-heros-v2';

const didUrl = `https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:${pb.authStore.model?.eddsa_public_key}`;

export const links: SidebarLink[] = [
	{
		label: 'Start',
		href: '/my',
		icon: RocketLaunch
	},
	{
		label: 'Signatures',
		icon: ClipboardDocumentCheck,
		subLinks: [
			{
				label: 'My folders',
				href: '/my/folders'
			},
			{
				label: 'My signatures',
				href: '/my/signatures'
			},
			{
				label: 'Validate signatures',
				href: '/my/validate'
			},
			{
				label: 'Multisignatures',
				disabled: true,
				href: '/'
			}
		]
	},
	{
		label: 'Notifications',
		icon: InboxArrowDown,
		disabled: true
	},
	{
		label: 'Identity',
		icon: Identification,
		subLinks: [
			{
				label: 'My DID',
				href: didUrl
			},
			{
				label: 'My Certificates',
				href: '/my/certificates'
			},
			{ label: 'My Verifiable Credentials', disabled: true, href: '/' }
		]
	},
	{
		label: 'Organizations',
		icon: Wallet,
		href: '/my/organizations'
	}
];
