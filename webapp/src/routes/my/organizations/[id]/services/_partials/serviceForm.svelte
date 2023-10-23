<script lang="ts">
	import { getCollectionSchema } from '$lib/pocketbase/schema/index.js';
	import {
		Collections,
		type IssuersRecord,
		type ServicesRecord,
		type ServicesResponse,
		type TemplatesRecord
	} from '$lib/pocketbase/types.js';
	import { fieldsSchemaToZod } from '$lib/pocketbaseToZod/index.js';
	import {
		Form,
		createForm,
		Input,
		Textarea,
		SubmitButton,
		Checkbox,
		Relations,
		createFormData
	} from '$lib/forms';
	import { Button, Drawer, Heading, Hr } from 'flowbite-svelte';
	import { Plus } from 'svelte-heros-v2';
	import { sineIn } from 'svelte/easing';
	import RecordForm from '$lib/recordForm/recordForm.svelte';
	import { createTypeProp } from '$lib/utils/typeProp.js';
	import IconButton from '$lib/components/iconButton.svelte';
	import { writable } from 'svelte/store';
	import type { ComponentProps } from 'svelte';
	import { pb } from '$lib/pocketbase/index.js';
	import { goto } from '$app/navigation';
	import { createFieldComponent } from '$lib/recordForm/fieldSchemaToInput.svelte';
	import JSONSchemaInput from './JSONSchemaInput.svelte';

	export let organizationId: string;
	export let initialData: ServicesResponse | undefined = undefined;

	const serviceSchema = fieldsSchemaToZod(getCollectionSchema(Collections.Services)!.schema);

	const superform = createForm(
		serviceSchema,
		async (e) => {
			const formData = createFormData(e.form.data);
			let record;
			if (Boolean(initialData)) {
				record = await pb.collection(Collections.Services).update(initialData!.id, formData);
			} else {
				record = await pb.collection(Collections.Services).create<ServicesResponse>(formData);
			}
			await goto(`/my/organizations/${organizationId}/services/${record.id}`);
		},
		{
			organization: organizationId,
			...(Boolean(initialData) && initialData)
		}
	);
	const { form } = superform;

	const issuerRecordProp = createTypeProp<IssuersRecord>();
	const templateRecordProp = createTypeProp<TemplatesRecord>();

	//

	function createModalStore(initialValue = false) {
		const open = writable(initialValue);
		function toggle() {
			open.update((v) => !v);
		}
		return { ...open, toggle };
	}

	const hideIssuerDrawer = createModalStore(true);
	const { toggle: toggleIssuerDrawer } = hideIssuerDrawer;

	const hideTemplateDrawer = createModalStore(true);
	const { toggle: toggleTemplateDrawer } = hideTemplateDrawer;

	//

	const drawerProps: ComponentProps<Drawer> = {
		transitionType: 'fly',
		backdrop: true,
		activateClickOutside: true,
		placement: 'right',
		transitionParams: {
			x: 320,
			duration: 200,
			easing: sineIn
		},
		class: '!p-6 !space-y-6',
		width: 'w-full md:w-4/5 lg:w-3/5'
	};

	//

	const submitButtonText = !Boolean(initialData) ? 'Create service' : 'Update service';
</script>

<Form {superform} showRequiredIndicator>
	<Input field="name" placeholder="Service name" />
	<Textarea field="description" placeholder="Service name" />

	<div>
		<Relations
			collection={Collections.Issuers}
			field="issuer"
			inputMode="select"
			displayFields={['name']}
		/>
		<div class="flex justify-end pt-4">
			<Button color="alternative" size="xs" on:click={toggleIssuerDrawer}>
				<Plus size="16" />
				<span class="ml-1">Add issuer</span>
			</Button>
		</div>
	</div>

	<div>
		<Relations
			collection={Collections.Templates}
			field="templates"
			inputMode="select"
			displayFields={['name']}
			multiple
		/>
		<div class="flex justify-end pt-4">
			<Button color="alternative" size="xs" on:click={toggleTemplateDrawer}>
				<Plus size="16" />
				<span class="ml-1">Add template</span>
			</Button>
		</div>
	</div>

	<Checkbox field="add_ons">Use add-ons</Checkbox>

	<Hr />

	<div class="flex justify-end">
		<SubmitButton>{submitButtonText}</SubmitButton>
	</div>
</Form>

<Drawer bind:hidden={$hideIssuerDrawer} {...drawerProps}>
	<div class="flex justify-between items-center">
		<Heading tag="h5">Create new Issuer</Heading>
		<IconButton on:click={toggleIssuerDrawer}></IconButton>
	</div>
	<RecordForm
		recordType={issuerRecordProp}
		collection={Collections.Issuers}
		on:success={(e) => {
			$form.issuer = e.detail.record.id;
			toggleIssuerDrawer();
		}}
	/>
</Drawer>

<Drawer bind:hidden={$hideTemplateDrawer} {...drawerProps}>
	<div class="flex justify-between items-center">
		<Heading tag="h5">Create new Template</Heading>
		<IconButton on:click={toggleTemplateDrawer}></IconButton>
	</div>
	<RecordForm
		recordType={templateRecordProp}
		collection={Collections.Templates}
		fieldsSettings={{
			hide: { organization: organizationId },
			components: {
				schema: createFieldComponent(JSONSchemaInput)
			}
		}}
		on:success={(e) => {
			$form.templates = [...$form.templates, e.detail.record.id];
			toggleTemplateDrawer();
		}}
	/>
</Drawer>
