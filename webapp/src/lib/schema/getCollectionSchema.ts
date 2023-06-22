import type { Collections } from '$lib/pocketbase-types';
import pb_schema from './pb_schema.json';
import type { CollectionSchema } from './types';

//

export function getCollectionSchema(
	collection: Collections | string
): CollectionSchema | undefined {
	return pb_schema.find((e) => e.name === collection || e.id === collection);
}
