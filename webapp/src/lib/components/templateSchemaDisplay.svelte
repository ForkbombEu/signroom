<script lang="ts">
	import { m } from '$lib/i18n';
	import type { ObjectSchema } from '$lib/jsonSchema/types';
	import type { TemplatesResponse } from '$lib/pocketbase/types';
	import {
		flattenCredentialSubjectProperties,
		objectSchemaToCredentialSubject
	} from '@api/download-microservices/utils/credential-subject';
	import { DEFAULT_LOCALE } from '@api/download-microservices/utils/locale';
	import { Effect, pipe, Either } from 'effect';
	import EmptyState from './emptyState.svelte';
	import { ExclamationTriangle } from 'svelte-heros-v2';

	//

	export let template: TemplatesResponse;

	//

	let propertyListEither = getTemplatePropertyList(template);

	function getTemplatePropertyList(template: TemplatesResponse) {
		return pipe(
			Effect.try(() =>
				pipe(
					template.schema as ObjectSchema,
					objectSchemaToCredentialSubject,
					flattenCredentialSubjectProperties
				)
			),
			Effect.either,
			Effect.runSync
		);
	}
</script>

<div class="divide-y rounded-lg border bg-gray-50">
	{#if propertyListEither.pipe(Either.isLeft)}
		<EmptyState title={m.Template_parsing_error()} icon={ExclamationTriangle} />
	{:else}
		{@const propertyList = propertyListEither.pipe(Either.getOrThrow)}

		{#each propertyList as [propertyId, property]}
			{@const displayName = property.display?.at(0)?.name}
			<div class="p-4">
				<p>
					{m.Property_ID()}: <span class="font-mono text-primary-700">{propertyId}</span>
				</p>
				{#if displayName}
					<p>
						{m.Display_name()}:
						<span class="text-primary-700">{displayName} ({DEFAULT_LOCALE})</span>
					</p>
				{/if}

				{#if property.mandatory}
					<p class="text-primary-700">{m.Required()}</p>
				{/if}
			</div>
		{/each}
	{/if}
</div>
