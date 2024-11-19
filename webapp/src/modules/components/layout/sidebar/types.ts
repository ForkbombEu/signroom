import type { IconComponent } from '@/components/types';

export type SidebarButtonProps = {
	text: string;
	icon?: IconComponent | string;
	disabled?: boolean;
};

export type SidebarLinkProps = SidebarButtonProps & {
	href: string;
	badge?: string;
	target?: '_blank';
};

export type SidebarGroupProps = SidebarButtonProps & {
	links: SidebarLinkProps[];
};

export type SidebarItemProps = SidebarGroupProps | SidebarLinkProps;
