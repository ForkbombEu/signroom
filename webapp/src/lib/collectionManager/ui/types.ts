import type { PBRecord, PBResponse, PBResponseKeys } from '$lib/utils/types';
import type { FieldComponent } from './fieldComponents/fieldComponentRenderer.svelte';
import type { RecordAction } from './recordActions';

export type FieldsComponents<RecordGeneric extends PBRecord = PBRecord> = Record<
	string,
	FieldComponent<RecordGeneric>
>;

export type Keys<RecordGeneric extends PBRecord = PBRecord> = PBResponseKeys<
	PBResponse<RecordGeneric>
>;

export type ViewAction = Exclude<RecordAction, 'create'>;
