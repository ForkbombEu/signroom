<script lang="ts">
	import Drawer from '$lib/components/drawer.svelte';
	import Icon from '$lib/components/icon.svelte';
	import ImagePreview from '$lib/components/imagePreview.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import SectionTitle from '$lib/components/sectionTitle.svelte';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import {
		Checkbox,
		Form,
		Input,
		Relations,
		Select,
		SubmitButton,
		Textarea,
		createForm,
		createFormData
	} from '$lib/forms';
	import FormError from '$lib/forms/formError.svelte';
	import { goto, m } from '$lib/i18n';
	import { pb } from '$lib/pocketbase/index.js';
	import { getCollectionSchema } from '$lib/pocketbase/schema/index.js';
	import {
		Collections,
		ServicesCryptographyOptions,
		TemplatesTypeOptions,
		type AuthorizationServersResponse,
		type IssuersResponse,
		type ServicesRecord,
		type ServicesResponse
	} from '$lib/pocketbase/types.js';
	import { fieldsSchemaToZod } from '$lib/pocketbaseToZod/index.js';
	import { RecordForm } from '$lib/recordForm';
	import { createTypeProp } from '$lib/utils/typeProp.js';
	import { Button, P } from 'flowbite-svelte';
	import { Plus } from 'svelte-heros-v2';
	import TemplateForm from '../../credential-templates/_partials/templateForm.svelte';
	import { createEventDispatcher } from 'svelte';

	export let organizationId: string;
	export let serviceId: string | undefined = undefined;
	export let initialData: Partial<ServicesRecord> = {};

	const serviceSchema = fieldsSchemaToZod(getCollectionSchema(Collections.Services)!.schema);

	const dispatch = createEventDispatcher<{ success: { record: ServicesResponse } }>();

	const superform = createForm(
		serviceSchema,
		async (e) => {
			const formData = createFormData(e.form.data);
			let record: ServicesResponse;
			if (serviceId) {
				record = await pb.collection(Collections.Services).update(serviceId, formData);
			} else {
				record = await pb.collection(Collections.Services).create<ServicesResponse>(formData);
			}
			dispatch('success', { record });
		},
		{
			organization: organizationId,
			...initialData
		}
	);
	const { form } = superform;

	const issuerRecordProp = createTypeProp<IssuersResponse>();
	const authorizationServerTypeProp = createTypeProp<AuthorizationServersResponse>();

	//

	const submitButtonText = !Boolean(serviceId)
		? m.Create_issuance_flow()
		: m.Update_issuance_flow();

	const credentialTypeOptions: string[] = Object.values(ServicesCryptographyOptions);

	const issuersType = createTypeProp<IssuersResponse>();
	const authorizationServersType = createTypeProp<AuthorizationServersResponse>();

	//

	let hideCredentialTemplateDrawer = createToggleStore(true);
	let hideAuthorizationTemplateDrawer = createToggleStore(true);
	let hideCredentialIssuerDrawer = createToggleStore(true);
	let hideAuthorizationServerDrawer = createToggleStore(true);
</script>

<Form {superform} showRequiredIndicator className="space-y-10">
	<PageCard>
		<SectionTitle
			tag="h5"
			title={m.Basic_info()}
			description={m.issuance_flow_form_main_info_description()}
		/>

		<Input
			field="name"
			options={{ label: m.Name(), placeholder: m.Age_verification() }}
			{superform}
		/>

		<Textarea
			field="description"
			options={{
				label: m.Description(),
				placeholder: m.issuance_flow_form_description_placeholder()
			}}
			{superform}
		/>

		<div class="flex items-start gap-8">
			<div class="grow">
				<Input
					field="logo"
					options={{
						placeholder: 'https://website.org/image.png',
						label: m.Credential_logo_URL(),
						type: 'url'
					}}
					{superform}
				/>
			</div>
			<div class="flex items-center gap-4">
				<P>{m.Preview()}</P>
				<ImagePreview src={$form.logo} alt={m.Credential_logo_URL()} />
			</div>
		</div>
	</PageCard>

	<PageCard>
		<SectionTitle
			tag="h5"
			title={m.Credential_info()}
			description={m.issuance_flow_form_credential_info_description()}
		/>

		<Select
			{superform}
			field="cryptography"
			options={{ label: m.Cryptography(), options: credentialTypeOptions }}
		/>

		<div>
			<Relations
				collection={Collections.Templates}
				field="credential_template"
				options={{
					label: m.Credential_template(),
					inputMode: 'select',
					displayFields: ['name']
				}}
				{superform}
			>
				<svelte:fragment slot="labelRight">
					<Button outline size="xs" on:click={hideCredentialTemplateDrawer.off}>
						{m.New_credential_template()}
						<Icon src={Plus} size={16} ml></Icon></Button
					>
				</svelte:fragment>
			</Relations>
		</div>

		<div>
			<Relations
				collection={Collections.Templates}
				field="authorization_template"
				options={{
					label: m.Authorization_template(),
					inputMode: 'select',
					displayFields: ['name']
				}}
				{superform}
			>
				<svelte:fragment slot="labelRight">
					<Button outline size="xs" on:click={hideAuthorizationTemplateDrawer.off}>
						{m.New_authorization_template()}
						<Icon src={Plus} size={16} ml></Icon></Button
					>
				</svelte:fragment>
			</Relations>
		</div>
	</PageCard>

	<PageCard>
		<SectionTitle
			tag="h5"
			title={m.Microservices()}
			description={m.issuance_flow_form_microservices_description()}
		/>

		<div>
			<Relations
				recordType={issuersType}
				collection={Collections.Issuers}
				field="credential_issuer"
				options={{
					inputMode: 'select',
					displayFields: ['name', 'endpoint'],
					label: m.Credential_issuer()
				}}
				{superform}
			>
				<svelte:fragment slot="labelRight">
					<Button outline size="xs" on:click={hideCredentialIssuerDrawer.off}>
						{m.New_credential_issuer()}
						<Icon src={Plus} size={16} ml></Icon></Button
					>
				</svelte:fragment>
			</Relations>
		</div>

		<div>
			<Relations
				recordType={authorizationServersType}
				collection={Collections.AuthorizationServers}
				field="authorization_server"
				options={{
					inputMode: 'select',
					displayFields: ['name', 'endpoint'],
					label: m.Authorization_server()
				}}
				{superform}
			>
				<svelte:fragment slot="labelRight">
					<Button outline size="xs" on:click={hideAuthorizationServerDrawer.off}>
						{m.New_authorization_server()}
						<Icon src={Plus} size={16} ml></Icon>
					</Button>
				</svelte:fragment>
			</Relations>
		</div>
	</PageCard>

	<PageCard>
		<SectionTitle
			tag="h5"
			title={m.Advanced_settings()}
			description={m.advanced_settings_description()}
		/>
		<div class="space-y-4">
			<Checkbox field="public" {superform}>
				{m.Is_public()}: {m.is_public_description()}
			</Checkbox>
			<Checkbox field="api_available" {superform}>{m.Can_be_requested_via_API()}</Checkbox>
		</div>
	</PageCard>

	<PageCard>
		<FormError />

		<div class="flex justify-end">
			<SubmitButton>{submitButtonText}</SubmitButton>
		</div>
	</PageCard>
</Form>

<PortalWrapper>
	<Drawer
		width="w-[700px]"
		placement="right"
		bind:hidden={$hideCredentialTemplateDrawer}
		title={m.New_credential_template()}
	>
		<div class="p-8">
			<TemplateForm
				initialData={{
					organization: organizationId,
					type: TemplatesTypeOptions.issuance
				}}
				on:success={(e) => {
					$form['credential_template'] = e.detail.id;
					hideCredentialTemplateDrawer.on();
				}}
			/>
		</div>
	</Drawer>
</PortalWrapper>

<PortalWrapper>
	<Drawer
		width="w-[700px]"
		placement="right"
		bind:hidden={$hideAuthorizationTemplateDrawer}
		title={m.New_authorization_template()}
	>
		<div class="p-8">
			<TemplateForm
				initialData={{
					organization: organizationId,
					type: TemplatesTypeOptions.authorization
				}}
				on:success={(e) => {
					$form['authorization_template'] = e.detail.id;
					hideAuthorizationTemplateDrawer.on();
				}}
			/>
		</div>
	</Drawer>
</PortalWrapper>

<PortalWrapper>
	<Drawer
		width="w-[700px]"
		placement="right"
		bind:hidden={$hideCredentialIssuerDrawer}
		title={m.New_credential_issuer()}
	>
		<div class="p-8">
			<RecordForm
				recordType={issuerRecordProp}
				collection={Collections.Issuers}
				fieldsSettings={{
					hide: {
						organization: organizationId
					}
				}}
				on:success={(e) => {
					$form['credential_issuer'] = e.detail.record.id;
					hideCredentialIssuerDrawer.on();
				}}
			/>
		</div>
	</Drawer>
</PortalWrapper>

<PortalWrapper>
	<Drawer
		width="w-[700px]"
		placement="right"
		bind:hidden={$hideAuthorizationServerDrawer}
		title={m.New_authorization_server()}
	>
		<div class="p-8">
			<RecordForm
				recordType={authorizationServerTypeProp}
				collection={Collections.AuthorizationServers}
				fieldsSettings={{
					hide: {
						organization: organizationId
					}
				}}
				on:success={(e) => {
					$form['authorization_server'] = e.detail.record.id;
					hideAuthorizationServerDrawer.on();
				}}
			/>
		</div>
	</Drawer>
</PortalWrapper>
