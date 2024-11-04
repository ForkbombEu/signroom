import type { ValueOf } from '@/utils/types';

export const RecordActions = {
	CREATE: 'create',
	DELETE: 'delete',
	EDIT: 'edit',
	SHARE: 'share',
	SELECT: 'select'
} as const;

export type RecordAction = ValueOf<typeof RecordActions>;
export const RecordActionsArray = Object.values(RecordActions);

export type ItemAction = Exclude<RecordAction, 'create'>;
