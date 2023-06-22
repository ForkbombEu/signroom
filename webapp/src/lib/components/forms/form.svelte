<script lang="ts" context="module">
	import { getContext } from 'svelte';
	import { formatUnknownException } from '$lib/errorHandling';
	import type { AnyZodObject } from 'zod';
	import type { UnwrapEffects } from 'sveltekit-superforms/index';
	import {
		superForm,
		setMessage,
		type FormOptions,
		type SuperForm,
		superValidateSync
	} from 'sveltekit-superforms/client';

	//

	export const FORM_KEY = Symbol('form');

	export type FormContext<T extends AnyZodObject> = {
		superform: SuperForm<T, unknown>;
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
		return superForm<T>(form, {
			SPA: true,
			applyAction: false,
			scrollToError: 'smooth',
			validators: schema,
			onUpdate: async (input) => {
				try {
					await submitFunction(input);
				} catch (e) {
					setMessage(input.form, formatUnknownException(e, 400).message);
				}
			}
		});
	}
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import { setContext } from 'svelte';
	import { Button, Spinner, Alert, Modal } from 'flowbite-svelte';

	//

	export let superform: SuperForm<UnwrapEffects<T>, any>;

	export let useDefaultSubmitButton = true;
	export let defaultSubmitButtonText = 'Submit';

	export let className = 'space-y-6';

	//

	const { errors, enhance, delayed, message } = superform;
	setContext<FormContext<T>>(FORM_KEY, { superform });

	$: error = Boolean($message) ? $message : $errors._errors ? $errors._errors.join('\n') : '';
</script>

<form class={className} method="post" use:enhance>
	<slot />

	{#if error}
		<Alert color="red" accent={false} dismissable>{error}</Alert>
	{/if}

	{#if useDefaultSubmitButton}
		<div class="flex justify-end">
			<Button type="submit" disabled={!$errors}>{defaultSubmitButtonText}</Button>
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
