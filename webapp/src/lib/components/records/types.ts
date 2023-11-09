import type { PBRecord, PBResponse, PBResponseKeys } from '$lib/utils/types';

export type RecordInputOptions<R extends PBRecord> = {
	name: string | undefined;
	placeholder: string | undefined;
	displayFields: PBResponseKeys<PBResponse<R>>[];
	excludeIds: string[];
	required: boolean;
	disabled: boolean;
};
