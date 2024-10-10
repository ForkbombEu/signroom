export const OrgRoles = {
	OWNER: 'owner',
	ADMIN: 'admin',
	MEMBER: 'member',
} as const;

export type OrgRole = typeof OrgRoles [keyof typeof OrgRoles];