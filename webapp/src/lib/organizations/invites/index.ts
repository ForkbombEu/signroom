import { createSessionStorageHandlers } from '$lib/utils/sessionStorage';

type OrganizationInviteSession = {
	organizationId: string;
	inviteId: string;
	email: string;
	userId?: string | undefined;
};

export const OrganizationInviteSession =
	createSessionStorageHandlers<OrganizationInviteSession>('organization_invite');
