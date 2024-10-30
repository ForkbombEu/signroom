import type { CollectionName } from '@/pocketbase/collections-models/types';
import type { CollectionExpands, CollectionRecords, CollectionResponses } from '@/pocketbase/types';
import type { KeyOf } from '@/utils/types';
import type { Simplify } from 'type-fest';

//

export type ExpandProp<C extends CollectionName> = KeyOf<CollectionExpands[C]>[];

export type ResolveExpandProp<C extends CollectionName, E extends ExpandProp<C>> = Partial<
	Pick<CollectionExpands[C], E[number]>
>;

export type InverseExpandProp = Partial<{
	[K in KeyOf<CollectionRecords>]: KeyOf<CollectionRecords[K]>;
}>;

export type ResolveInverseExpandProps<E extends InverseExpandProp> = {
	[K in KeyOf<E> & KeyOf<CollectionRecords> as `${K}_via_${E[K]}`]?: Array<CollectionRecords[K]>;
};

export type ExpandableResponse<
	C extends CollectionName,
	Expand extends ExpandProp<C> = never,
	InverseExpand extends InverseExpandProp = never
> = CollectionResponses[C] & {
	expand?: Simplify<ResolveExpandProp<C, Expand> & ResolveInverseExpandProps<InverseExpand>>;
};
