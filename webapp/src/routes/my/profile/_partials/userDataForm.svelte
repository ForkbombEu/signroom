<script lang="ts">
	import {
		Form,
		createForm,
		createFormData,
		FormError,
		SubmitButton,
		Input,
		Checkbox,
		File
	} from '$lib/forms';

	import { currentUser, pb } from '$lib/pocketbase';
	import { createEventDispatcher } from 'svelte';
	import { z } from 'zod';

	const dispatch = createEventDispatcher<{ success: {} }>();

	const schema = z.object({
		name: z.string().min(3).optional(),
		email: z.string().email(),
		emailVisibility: z.boolean().optional(),
		avatar: z
			.instanceof(File)
			.refine((file) => file.type === 'image/png' || file.type === 'image/jpeg')
			.refine((file) => file.size < 1024 * 1024 * 2)
			.optional()
	});

	const initialData: z.infer<typeof schema> = {
		name: $currentUser!.name,
		email: $currentUser!.email,
		emailVisibility: $currentUser!.emailVisibility
	};

	const superform = createForm(
		schema,
		async ({ form }) => {
			const formData = createFormData(form.data);
			$currentUser = await pb.collection('users').update($currentUser!.id, formData);
			dispatch('success');
		},
		initialData
	);
</script>

<Form {superform} defaultSubmitButtonText="Update profile">
	<Input field="name" label="Username" />
	<div class="space-y-2">
		<Input field="email" type="email" />
		<Checkbox field="emailVisibility">
			<span>Show email to other users</span>
		</Checkbox>
	</div>
	<FileInput field="avatar" />
</Form>
