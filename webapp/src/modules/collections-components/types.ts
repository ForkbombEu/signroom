import type { CollectionName } from '@/pocketbase/collections-models';
import type { CollectionExpands, CollectionResponses } from '@/pocketbase/types';
import type { KeyOf } from '@/utils/types';

//

export type ExpandProp<C extends CollectionName> = KeyOf<CollectionExpands[C]>[];

export type ResolveExpandProp<C extends CollectionName, E extends ExpandProp<C>> = Partial<
	Pick<CollectionExpands[C], E[number]>
>;

export type ExpandableResponse<
	C extends CollectionName,
	Expand extends ExpandProp<C> = never
> = CollectionResponses[C] & {
	expand?: ResolveExpandProp<C, Expand>;
};

// expand?: Simplify<ResolveExpandProp<C, Expand> & ResolveInverseExpandProps<C, InverseExpand>>;
