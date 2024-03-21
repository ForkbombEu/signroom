<script lang="ts">
	import { getCollectionSchema } from '$lib/pocketbase/schema/index.js';
	import {
		Collections,
		ServicesCredentialTypeOptions,
		type IssuersResponse,
		type ServicesResponse,
		type TemplatesResponse,
		type AuthorizationServersResponse,
		type RelyingPartiesResponse
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
		createFormData,
		Select
	} from '$lib/forms';
	import { Drawer, Heading, Hr } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import RecordForm from '$lib/recordForm/recordForm.svelte';
	import { createTypeProp } from '$lib/utils/typeProp.js';
	import IconButton from '$lib/components/iconButton.svelte';
	import { writable } from 'svelte/store';
	import type { ComponentProps } from 'svelte';
	import { pb } from '$lib/pocketbase/index.js';
	import { goto } from '$lib/i18n';
	import { createFieldComponent } from '$lib/recordForm/fieldSchemaToInput.svelte';
	import JSONSchemaInput from './JSONSchemaInput.svelte';
	import FormError from '$lib/forms/formError.svelte';
	import { m } from '$lib/i18n';

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
			await goto(`/my/organizations/${organizationId}/credential-issuances/${record.id}`);
		},
		{
			organization: organizationId,
			...(Boolean(initialData) && initialData)
		}
	);
	const { form } = superform;

	const issuerRecordProp = createTypeProp<IssuersResponse>();
	const templateRecordProp = createTypeProp<TemplatesResponse>();

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

	const submitButtonText = !Boolean(initialData)
		? m.Create_issuance_flow()
		: m.Update_issuance_flow();

	const credentialTypeOptions: string[] = Object.values(ServicesCredentialTypeOptions);

	const issuersType = createTypeProp<IssuersResponse>();
	const authorizationServersType = createTypeProp<AuthorizationServersResponse>();
	const relyingPartiesType = createTypeProp<RelyingPartiesResponse>();
</script>

<Form {superform} showRequiredIndicator>
	<Heading tag="h5">{m.Main_info()}</Heading>

	<Input
		field="name"
		options={{ placeholder: m.Service_name(), label: m.Service_name() }}
		{superform}
	/>

	<Textarea
		field="description"
		options={{ placeholder: m.Service_description(), label: m.Service_description() }}
		{superform}
	/>

	<Select
		{superform}
		field="credential_type"
		options={{ label: m.Select_credential_cryptography_type(), options: credentialTypeOptions }}
	/>

	<div>
		<Relations
			collection={Collections.Templates}
			field="templates"
			options={{
				label: m.Select_one_or_more_templates_for_this_service(),
				inputMode: 'select',
				displayFields: ['name'],
				multiple: true
			}}
			{superform}
		/>
	</div>

	<Hr />

	<Heading tag="h5">{m.Servers()}</Heading>

	<div>
		<Relations
			recordType={issuersType}
			collection={Collections.Issuers}
			field="issuer"
			options={{
				inputMode: 'select',
				displayFields: ['name', 'endpoint'],
				label: m.Select_a_credential_issuer()
			}}
			{superform}
		/>
	</div>

	<div>
		<Relations
			recordType={authorizationServersType}
			collection={Collections.AuthorizationServers}
			field="authorization_server"
			options={{
				inputMode: 'select',
				displayFields: ['name', 'endpoint'],
				label: m.Select_an_authorization_service()
			}}
			{superform}
		/>
	</div>

	<div>
		<Relations
			recordType={relyingPartiesType}
			collection={Collections.RelyingParties}
			field="relying_party"
			options={{
				inputMode: 'select',
				displayFields: ['name', 'endpoint'],
				label: m.Select_a_relying_party()
			}}
			{superform}
		/>
	</div>

	<Hr />

	<Heading tag="h5">Options</Heading>

	<Checkbox field="add_ons" {superform}>{m.Use_addons()}</Checkbox>
	<Checkbox field="published" {superform}>{m.Published()}</Checkbox>

	<Hr />

	<FormError />

	<div class="flex justify-end">
		<SubmitButton>{submitButtonText}</SubmitButton>
	</div>
</Form>

<Drawer bind:hidden={$hideIssuerDrawer} {...drawerProps}>
	<div class="flex justify-between items-center">
		<Heading tag="h5">{m.Create_new_Issuer()}</Heading>
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
		<Heading tag="h5">{m.Create_new_Template()}</Heading>
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
