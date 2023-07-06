<script lang="ts">
	import { formFieldProxy } from 'sveltekit-superforms/client';

	import { Fileupload, Helper, Label, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { getFormContext } from './form.svelte';
	import FieldError, { fieldHasErrors } from './fieldParts/fieldError.svelte';
	import FieldLabel from './fieldParts/fieldLabel.svelte';

	//

	export let field: string;
	export let label = '';
	export let multiple = false;
	export let accept: string[] = [];
	export let required = false;

	const { superform } = getFormContext();
	const { validate } = superform;
	const { value, errors } = formFieldProxy(superform, field);

	let fileList: FileList | undefined;
	let rejectedFiles: { file: File; errors: string[] }[] = [];

	$: if (fileList) {
		handleChange(fileList);
	}

	async function handleChange(fileList: FileList) {
		rejectedFiles = [];

		let data = multiple ? [...fileList] : fileList[0];
		const errors = await validate(field, { value: data, update: false });

		if (!errors) {
			await validate(field, { value: data, taint: true });
			return;
		}

		if (!multiple && data instanceof File) {
			rejectedFiles = [{ file: data, errors }];
		}

		if (multiple && Array.isArray(data)) {
			const errorsRecord = errors as unknown as Record<string, string[]>;
			const rejectedFilesIndexes = Object.keys(errorsRecord).map((key) => Number(key));

			for (const index of rejectedFilesIndexes) {
				rejectedFiles = [
					...rejectedFiles,
					{
						file: data[index],
						errors: errorsRecord[index]
					}
				];
			}

			data = data.filter((_, index) => !rejectedFilesIndexes.includes(index));
			await validate(field, { value: data, taint: true });
		}
	}

	$: hasErrors = fieldHasErrors($errors);
</script>

<div class="space-y-3">
	<FieldLabel {field} text={label} />
	<Fileupload
		id={field}
		name={field}
		bind:files={fileList}
		{multiple}
		{required}
		accept={accept.join(', ')}
		data-invalid={hasErrors}
	/>

	{#if !multiple && $value && $value instanceof File}
		<Listgroup>
			<ListgroupItem>
				{$value.name}
			</ListgroupItem>
		</Listgroup>
	{/if}

	{#if multiple && $value.length > 0}
		<div class="space-y-1">
			{#if rejectedFiles.length > 0}
				<Helper>ACCEPTED FILES</Helper>
			{/if}
			<Listgroup>
				{#each $value as file}
					<ListgroupItem>
						{file.name}
					</ListgroupItem>
				{/each}
			</Listgroup>
		</div>
	{/if}

	<FieldError {field} />

	{#if rejectedFiles.length > 0}
		<div class="space-y-1">
			<Helper>REJECTED FILES</Helper>
			<Listgroup>
				{#each rejectedFiles as { file, errors }}
					<ListgroupItem>
						<div>
							{file.name}
						</div>
						<div>
							{#each errors as error}
								<Helper color="red">{error}</Helper>
							{/each}
						</div>
					</ListgroupItem>
				{/each}
			</Listgroup>
		</div>
	{/if}
</div>
