import type { X } from 'lucide-svelte';

//

export type IconComponent = typeof X;

export interface Link {
	href: string;
	text: string;
}

export interface LinkWithIcon extends Link {
	icon?: IconComponent;
}
