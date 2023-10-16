import type { SidebarLink } from '$lib/layout';
import { ClipboardDocumentCheck } from 'svelte-heros';
import {
	RocketLaunch,
	InboxArrowDown,
	Identification,
	Wallet
} from 'svelte-heros-v2';

const didUrl = `https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:`;

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
		label: 'Notification',
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
			{ label: 'My Verifiable Credentials', disabled: true, href: '/' }
		]
	},
	{
		label: 'Organizations',
		icon: Wallet,
		disabled: true
	}
];
