<script context="module" lang="ts">
	import type { GenericRecord } from '@/utils/types';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { ExpandProp, ExpandableResponse } from './types';

	export type CollectionFieldOptions<C extends CollectionName, Expand extends ExpandProp<C>> = {
		expand?: Expand;
		filter?: string;
		exclude?: RecordIdString[];
		displayFn?: RecordPresenter<ExpandableResponse<C, Expand>>;
		displayFields?: (keyof CollectionRecords[C])[];
		mode?: 'search' | 'select';
		multiple?: boolean;
	};
</script>

<script
	lang="ts"
	generics="Data extends GenericRecord, C extends CollectionName, Expand extends ExpandProp<C> = never"
>
	import { m } from '@/i18n';
	import { ensureArray } from '@/utils/other';
	import ListItem from '@/components/custom/listItem.svelte';
	import { pb } from '@/pocketbase';
	import ArrayOrItemManager from '@/components/custom/arrayOrItemManager.svelte';
	import type { Writable } from 'svelte/store';
	import { CollectionSelect } from '.';
	import { createDefaultRecordPresenter, type RecordPresenter } from './utils';
	import type { CollectionRecords, RecordIdString } from '@/pocketbase/types';
	import * as Form from '@/components/ui/form';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import { fieldProxy } from 'sveltekit-superforms/client';
	import type { FieldOptions } from '@/forms/fields/types';
	import FieldWrapper from '@/forms/fields/parts/fieldWrapper.svelte';
	import CollectionSearch from './collectionSearch.svelte';
	import List from '@/components/custom/list.svelte';
	import T from '@/components/custom/t.svelte';

	//

	export let form: SuperForm<Data>;
	export let name: FormPath<Data>;
	export let collection: C;
	export let expand: Expand | undefined = undefined;
	export let options: Partial<FieldOptions> & CollectionFieldOptions<C, Expand> = {};

	let {
		mode = 'select',
		displayFn: presenter = createDefaultRecordPresenter(collection),
		multiple = false,
		exclude = []
	} = options;

	//

	const valueProxy = fieldProxy(form, name) as Writable<string | string[] | undefined>;

	function fetchRecord(collection: C, id: string): Promise<ExpandableResponse<C, Expand>> {
		return pb.collection(collection).getOne(id, { requestKey: null });
	}

	function valueExists(value: typeof $valueProxy) {
		if (Array.isArray(value)) return Boolean(value.length);
		else return Boolean(value);
	}

	function addItem(proxy: typeof valueProxy, value: string, multiple: boolean) {
		proxy.update((v) => {
			if (multiple) {
				if (Array.isArray(v)) {
					if (v.includes(value)) return v;
					else return [...v, value];
				} else return [value];
			} else {
				return value;
			}
		});
	}
</script>

<Form.Field {form} {name}>
	<FieldWrapper field={name} {options} let:attrs>
		{#if mode == 'search'}
			<CollectionSearch
				{collection}
				{expand}
				exclude={[...exclude, ...ensureArray($valueProxy)]}
				filter={options.filter}
				displayFn={options.displayFn}
				displayFields={options.displayFields}
				onSelect={(record) => {
					addItem(valueProxy, record.id, multiple);
				}}
			/>
		{:else if mode == 'select'}
			<CollectionSelect
				{collection}
				{expand}
				exclude={[...exclude, ...ensureArray($valueProxy)]}
				filter={options.filter}
				displayFn={options.displayFn}
				displayFields={options.displayFields}
				onSelect={(record) => {
					if (record) addItem(valueProxy, record.id, multiple);
				}}
				clearValueOnSelect
				{attrs}
			/>
		{/if}

		<List class="min-h-[42px]">
			{#if valueExists($valueProxy)}
				<ArrayOrItemManager bind:data={$valueProxy} let:item let:removeItem>
					<ListItem on:click={removeItem}>
						{#await fetchRecord(collection, item) then record}
							{presenter(record)}
						{/await}
					</ListItem>
				</ArrayOrItemManager>
			{:else}
				<ListItem hideButton class="h-10 !justify-center">
					<T tag="small" class="text-secondary-foreground/30 font-normal">
						{m.No_items_selected()}
					</T>
				</ListItem>
			{/if}
		</List>
	</FieldWrapper>
</Form.Field>
