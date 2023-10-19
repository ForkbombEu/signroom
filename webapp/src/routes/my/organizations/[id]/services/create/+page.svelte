<script lang="ts">
	import { getCollectionSchema } from '$lib/pocketbase/schema/index.js';
	import { Collections, type IssuersRecord } from '$lib/pocketbase/types.js';
	import { fieldsSchemaToZod } from '$lib/pocketbaseToZod/index.js';
	import { Form, createForm, Input, Textarea, SubmitButton, Checkbox, Relations } from '$lib/forms';
	import { Button, Drawer, Heading } from 'flowbite-svelte';
	import { Plus } from 'svelte-heros-v2';
	import { sineIn } from 'svelte/easing';
	import RecordForm from '$lib/recordForm/recordForm.svelte';
	import { createTypeProp } from '$lib/utils/typeProp.js';
	import IconButton from '$lib/components/iconButton.svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { ComponentProps } from 'svelte';

	export let data;

	const serviceSchema = fieldsSchemaToZod(getCollectionSchema(Collections.Services)!.schema);

	const superform = createForm(
		serviceSchema,
		(e) => {
			console.log(e);
		},
		{
			organization: data.organization.id
		}
	);

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

	const issuerRecordProp = createTypeProp<IssuersRecord>();
</script>

<Form {superform}>
	<Input field="name" placeholder="Service name" />
	<Textarea field="description" placeholder="Service name" />
	<Checkbox field="add_ons">Use add ons</Checkbox>

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
		/>
		<div class="flex justify-end pt-4">
			<Button color="alternative" size="xs" on:click={toggleTemplateDrawer}>
				<Plus size="16" />
				<span class="ml-1">Add issuer</span>
			</Button>
		</div>
	</div>

	<div class="flex justify-end">
		<SubmitButton>Create service</SubmitButton>
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
			superform.form.set({ issuer: e.detail.record.id });
			toggleIssuerDrawer();
		}}
	/>
</Drawer>
