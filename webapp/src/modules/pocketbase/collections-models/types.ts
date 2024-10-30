import collectionsModels from '@/pocketbase/collections-models/collections-models.generated';

//

export type CollectionsModels = typeof collectionsModels;

export type AnyCollectionModel = CollectionsModels[number];
export type CollectionName = AnyCollectionModel['name'];
export type CollectionModel<C extends CollectionName> = Extract<AnyCollectionModel, { name: C }>;

export type AnyFieldConfig = AnyCollectionModel['schema'][number];
export type FieldType = AnyFieldConfig['type'];
export type FieldConfig<T extends FieldType> = Extract<AnyFieldConfig, { type: T }>;
