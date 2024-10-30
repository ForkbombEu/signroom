<script lang="ts" generics="C extends CollectionName">
	import { capitalize } from '@/utils/other';

	import type { SuperForm } from 'sveltekit-superforms';

	import { getCollectionModel } from '@/pocketbase/collections-models';
	import type { CollectionName } from '@/pocketbase/collections-models/types';
	import type { GenericRecord, KeyOf, MaybePromise } from '@/utils/types';
	import type { CollectionRecords, RecordIdString } from '@/pocketbase/types';
	import { Button } from '@/components/ui/button';
	import { m } from '@/i18n';
	import type { AnyFieldConfig } from '@/pocketbase/collections-models/types';
	import { Form, FormError, SubmitButton, type FormOptions } from '@/forms';
	import { setupCollectionForm } from './collectionFormSetup';
	import FieldSchemaToInput from './fieldConfigToField.svelte';
	import {
		type OnCollectionFormSuccess,
		type FieldsOptions,
		defaultFieldsOptions,
		type UIOptions,
		defaultUIOptions
	} from './formOptions';

	//

	export let collection: C;
	export let recordId: RecordIdString | undefined = undefined;
	export let initialData: Partial<CollectionRecords[C]> = {};

	export let onSuccess: OnCollectionFormSuccess<C> = () => {};
	export let onCancel: () => MaybePromise<void> = () => {};

	export let fieldsOptions: Partial<FieldsOptions<C>> = defaultFieldsOptions<C>();
	export let uiOptions: UIOptions = defaultUIOptions();
	export let superformsOptions: FormOptions<CollectionRecords[C]> = {};

	/* */

	let form: SuperForm<CollectionRecords[C]>;
	$: form = setupCollectionForm<C>({
		collection,
		fieldsOptions,
		recordId,
		onSuccess,
		uiOptions,
		superformsOptions: superformsOptions as FormOptions<GenericRecord>,
		initialData
	});

	/* Sorting fields */

	let fieldsConfigs: AnyFieldConfig[] = getCollectionModel(collection)
		.schema.sort(createFieldConfigSorter(fieldsOptions?.order))
		.filter(
			(config) => !fieldsOptions?.exclude?.includes(config.name as KeyOf<CollectionRecords[C]>)
		);

	function createFieldConfigSorter(order: string[] = []) {
		return (a: AnyFieldConfig, b: AnyFieldConfig) => {
			const aIndex = order.indexOf(a.name);
			const bIndex = order.indexOf(b.name);
			if (aIndex === -1 && bIndex === -1) {
				return 0;
			}
			if (aIndex === -1) {
				return 1;
			}
			if (bIndex === -1) {
				return -1;
			}
			return aIndex - bIndex;
		};
	}

	/* */

	let submitButtonText: string | undefined = undefined;
	$: submitButtonText = Boolean(uiOptions?.submitButtonText)
		? uiOptions?.submitButtonText
		: Boolean(recordId)
			? m.Edit_record()
			: m.Create_record();

	/* ts helpers */

	function getFieldConfigName(fieldConfig: AnyFieldConfig) {
		return fieldConfig.name as KeyOf<CollectionRecords[C]>;
	}

	function getRelationsOptions(
		relationProp: FieldsOptions<C>['relations'],
		fieldName: KeyOf<CollectionRecords[C]>
	) {
		// @ts-expect-error Type mismatch but we don't care
		return relationProp?.[fieldName] ?? {};
	}
</script>

<Form
	{form}
	hideRequiredIndicator={Boolean(uiOptions.hideRequiredIndicator)}
	hide={['submitButton', 'error']}
>
	{#key initialData}
		{#each fieldsConfigs as fieldSchema}
			{@const name = getFieldConfigName(fieldSchema)}
			{@const hidden = Object.keys(fieldsOptions?.hide ?? {}).includes(name)}
			{@const label = capitalize(fieldsOptions?.labels?.[name] ?? name)}
			{@const component = fieldsOptions?.components?.[name]}
			{@const collectionFieldOptions = getRelationsOptions(fieldsOptions?.relations ?? {}, name)}
			{@const description = fieldsOptions?.descriptions?.[name]}
			{@const placeholder = fieldsOptions?.placeholders?.[name]}
			<FieldSchemaToInput
				{description}
				{label}
				fieldConfig={fieldSchema}
				{hidden}
				{component}
				{collectionFieldOptions}
				{placeholder}
			/>
		{/each}
	{/key}

	<slot {form} />

	<FormError />

	<div class="flex justify-between gap-2">
		<div>
			<slot name="footer-left"></slot>
		</div>
		<div class="flex gap-2">
			<slot name="footer-right"></slot>
			{#if uiOptions.showCancelButton}
				<Button variant="outline" on:click={onCancel}>{m.Cancel()}</Button>
			{/if}
			<SubmitButton>{submitButtonText}</SubmitButton>
		</div>
	</div>
</Form>
