import { getCollectionModel, getCollectionNameFromId } from '@/pocketbase/collections-models';
import type { CollectionName } from '@/pocketbase/collections-models/types';
import { String } from 'effect';
import type { CollectionResponses } from '@/pocketbase/types';
import type { GenericRecord } from '@/utils/types';
import type { ValueOf } from 'type-fest';

//

export function excludeIdsFilter(ids: string[]) {
	return ids.map((id) => `id != '${id}'`).join(' && ');
}

export function searchTextFilter(collection: CollectionName, text: string) {
	return getCollectionFieldNames(collection)
		.map((f) => `${f} ~ "${text}"`)
		.join(' || ');
}

function getCollectionFieldNames(collection: CollectionName): string[] {
	const fieldNames: string[] = getCollectionModel(collection).schema.map((field) => field.name);
	if (collection == 'users') fieldNames.push('email');
	return fieldNames;
}

//

export function mergeFilters(...filters: Array<string | undefined>): string | undefined {
	const validFilters = filters.filter(String.isString).filter(String.isNonEmpty);
	if (validFilters.length == 1) return validFilters[0];
	else if (validFilters.length > 1) return validFilters.map((f) => `(${f})`).join(' && ');
	else return undefined;
}

//

export function createRecordDisplayFromFields<R extends GenericRecord>(
	record: R,
	displayFields: (keyof R)[],
	separator = '–'
): string {
	return displayFields
		.map((f) => record[f])
		.filter((f) => Boolean(f))
		.join(` ${separator} `);
}

export type RecordPresenter<R> = (record: R) => string;

export function createDefaultRecordPresenter<C extends CollectionName, R = CollectionResponses[C]>(
	collection: C
): RecordPresenter<R> {
	const fields = getCollectionModel(collection)
		.schema.filter((field) => field.type == 'text')
		.map((field) => field.name) as (keyof R)[];

	return (record) => {
		return fields.map((f) => record[f]).join(' - ');
	};
}

export function createRecordDisplay<R extends ValueOf<CollectionResponses>>(
	record: R,
	displayFields: (keyof R)[] | undefined,
	displayFn: RecordPresenter<R> | undefined
) {
	if (displayFields) return createRecordDisplayFromFields(record, displayFields);
	else if (displayFn) return displayFn(record);
	else {
		const presenter = createDefaultRecordPresenter(getCollectionNameFromId(record.collectionId));
		return presenter(record);
	}
}
