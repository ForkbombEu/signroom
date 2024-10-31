import type { CollectionModel, CollectionName } from './types';
import collectionsModels from './collections-models.generated';
import { Array, Option, pipe } from 'effect';
import type { WritableDeep, SimplifyDeep } from 'type-fest';

//

export function getCollectionModel<C extends CollectionName>(collection: C) {
	return pipe(
		collectionsModels,
		Array.findFirst((model) => model.name == collection),
		Option.getOrThrowWith(() => new CollectionNotFoundError())
	) as SimplifyDeep<WritableDeep<CollectionModel<C>>>;
}

export function getCollectionNameFromId(id: string): CollectionName {
	return pipe(
		collectionsModels,
		Array.findFirst((model) => model.id == id),
		Option.getOrThrowWith(() => new CollectionNotFoundError()),
		(model) => model.name
	);
}

//

class CollectionNotFoundError extends Error {}
