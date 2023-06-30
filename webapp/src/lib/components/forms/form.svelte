<script lang="ts" context="module">
	import type { StringPath, StringPathLeaves } from 'sveltekit-superforms/dist/stringPath';

	import { getContext } from 'svelte';
	import { normalizeError, type ClientResponseErrorData } from '$lib/errorHandling';
	import type { AnyZodObject } from 'zod';
	import type { UnwrapEffects } from 'sveltekit-superforms/index';
	import {
		superForm,
		setMessage,
		setError,
		type FormOptions,
		type SuperForm,
		superValidateSync
	} from 'sveltekit-superforms/client';

	//

	export const FORM_KEY = Symbol('form');

	export type FormContext<T extends AnyZodObject> = {
		superform: SuperForm<T, ClientResponseErrorData>;
	};

	export function getFormContext<T extends AnyZodObject>(): FormContext<T> {
		return getContext(FORM_KEY);
	}

	//

	export type SubmitFunction<T extends AnyZodObject> = NonNullable<
		FormOptions<T, unknown>['onUpdate']
	>;

	export function createForm<T extends AnyZodObject>(
		schema: any,
		submitFunction: SubmitFunction<T> = async () => {},
		initialData: any = undefined
	) {
		const form = superValidateSync(initialData, schema, { errors: false });
		return superForm<T, ClientResponseErrorData>(form, {
			SPA: true,
			applyAction: false,
			scrollToError: 'smooth',
			validators: schema,
			onUpdate: async (input) => {
				try {
					await submitFunction(input);
				} catch (e) {
					let error = normalizeError(e);
					for (const [key, value] of Object.entries(error.data)) {
						if (Boolean(input.form.data[key])) {
							setError(input.form, key as StringPathLeaves<T>, value.message);
							delete error.data[key];
						}
					}
					setMessage(input.form, error);
				}
			}
		});
	}

	type SuperFormAllErrors = {
		path: string;
		messages: string[];
	}[];

	export function formHasErrors(allErrors: SuperFormAllErrors): boolean {
		const checks: boolean[] = [];
		if (allErrors.length === 0) return false;
		else {
			for (const error of allErrors) {
				if (error.messages.length > 0) checks.push(true);
				// if (typeof value === 'object') checks.push(formHasErrors(value));
				// else if (Boolean(value)) checks.push(true);
			}
		}
		return checks.some((check) => check);
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { Button, Spinner, Alert, Modal } from 'flowbite-svelte';
	import Error from './error.svelte';

	type T = $$Generic<AnyZodObject>;

	//

	export let superform: SuperForm<UnwrapEffects<T>, any>;

	export let useDefaultSubmitButton = true;
	export let defaultSubmitButtonText = 'Submit';

	export let className = 'space-y-6';

	//

	const { enhance, delayed, allErrors } = superform;
	setContext<FormContext<T>>(FORM_KEY, { superform });

	$: hasErrors = formHasErrors($allErrors);
</script>

<form class={className} method="post" use:enhance>
	<slot />

	<Error />

	{#if useDefaultSubmitButton}
		<div class="flex justify-end">
			<Button type="submit" disabled={hasErrors}>{defaultSubmitButtonText}</Button>
		</div>
	{/if}

	{#if $delayed}
		<div class="m-0 p-0">
			<Modal open={$delayed} permanent>
				<Spinner />
			</Modal>
		</div>
	{/if}
</form>
