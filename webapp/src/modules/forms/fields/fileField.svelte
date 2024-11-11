<script context="module" lang="ts">
	import type { GenericRecord, If, IsArray } from '@/utils/types';
</script>

<script lang="ts" generics="Data extends GenericRecord">
	import type { SuperForm, FormPath } from 'sveltekit-superforms';
	import { fieldProxy } from 'sveltekit-superforms';

	import * as Form from '@/components/ui/form';
	import FieldWrapper from './parts/fieldWrapper.svelte';
	import FileManager, {
		type FileManagerValidator,
		type RejectedFile
	} from '@/components/custom/fileManager.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { buttonVariants } from '@/components/ui/button';
	import type { FieldOptions } from './types';
	import type { Writable } from 'svelte/store';
	import type { ComponentProps } from 'svelte';
	import { pipe, Tuple } from 'effect';

	//

	export let form: SuperForm<Data>;
	export let name: FormPath<Data>;
	export let options: Partial<FieldOptions & Omit<ComponentProps<Input>, 'type' | 'value'>> = {};

	$: multiple = options.multiple ?? false;

	//

	const valueProxy = fieldProxy(form, name) as Writable<File | File[]>;

	/* Files validation
	 *
	 * - Objective
	 * Here we are trying to validate files *before* they arrive into the form
	 * - Reason(s)
	 * If a single file is bad, it must not replace a good one
	 * If multiple files are uploaded, good ones must be saved
	 * - Restated objective
	 * We want to reject bad files and notify the user about it
	 *
	 * - Implementation
	 * We want to use the `validate` function from superforms, but in "preview mode"
	 * and use it as validator for `FileManager` component
	 */

	let { validate } = form;

	function previewFieldValidation<T = unknown>(field: string, data: T) {
		// TODO: this should throw when "field" is not valid
		return validate(field as any, {
			// @ts-ignore
			value: data,
			taint: false,
			update: false
		}) as Promise<ValidationResult<T>>;
	}

	/* Type fix
	 *
	 * Superforms `validate` function return type is not correct:
	 * - Function signature says it is `string[] | undefined`
	 * - If you validate an array value, it is actually `Record<number, string[]> | undefined`
	 */

	type ValidationResult<Input> =
		| undefined
		| If<IsArray<Input>, Record<number | '_errors', string[]>, string[]>;

	/* Files validator */

	const validator: FileManagerValidator = async (newFiles) => {
		if (!multiple) {
			const newFile = newFiles[0];
			const validationResult = await previewFieldValidation(name, newFile);
			const acceptedFiles: File[] = [];
			const rejectedFiles: RejectedFile[] = [];
			if (!validationResult) acceptedFiles.push(newFile);
			else
				rejectedFiles.push({
					file: newFile,
					reasons: validationResult
				});
			return {
				acceptedFiles,
				rejectedFiles
			};
		} else {
			/**
			 * - Issue
			 * We cannot validate multiple files together with superforms [validate] function
			 * - Reason
			 * The validation result is a record where the keys are not linked to the files
			 * - To reproduce, run here:
			 * `console.log(await previewFieldValidation(name, newfiles))`
			 * and upload multiple files, some of which invalid
			 *
			 * - Solution
			 * We validate each file as if it is an array, then extract the result
			 * `previewFieldValidation(name, [f])`
			 */
			const validationEntries = await pipe(
				newFiles.map((f) =>
					previewFieldValidation(name, [f])
						.then((result) => (result ? result[0] : []))
						.then((result) => Tuple.make(f, result))
				),
				(entries) => Promise.all(entries)
			);

			const acceptedFiles: File[] = validationEntries
				.filter(([_, errors]) => errors.length == 0)
				.map(([file]) => file);

			const rejectedFiles: RejectedFile[] = validationEntries
				.filter(([_, errors]) => errors.length > 0)
				.map(([file, errors]) => ({
					file,
					reasons: errors
				}));

			return {
				acceptedFiles,
				rejectedFiles
			};
		}
	};
</script>

<Form.Field {form} {name}>
	<FieldWrapper field={name} {options} let:attrs>
		<FileManager bind:data={$valueProxy} {validator} {multiple} let:addFiles>
			<Input
				{...attrs}
				{...options}
				placeholder="Upload a file"
				type="file"
				class="hover:bg-primary/10 file:bg-secondary-foreground file:text-secondary p-0 py-1 pl-1 file:mr-4 file:h-full file:rounded-md file:px-4 hover:cursor-pointer file:hover:cursor-pointer"
				on:change={(e) => {
					const fileList = e.currentTarget.files;
					if (fileList) addFiles([...fileList]);
					e.currentTarget.value = '';
				}}
			/>
			<!-- e.currentTarget.value = '' is needed to clear the file input -->
		</FileManager>
	</FieldWrapper>
</Form.Field>
