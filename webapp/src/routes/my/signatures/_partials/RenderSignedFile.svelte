<script lang="ts">
	import { Alert, Badge, Button, Card, Heading, InformationCircle, TabItem, Tabs } from 'flowbite-svelte';
	import RenderJades from './RenderJades.svelte';
	import RenderXades from './RenderXades.svelte';
	import RenderPades from './RenderPades.svelte';
	import type { SignedFile } from './SignedFileDisplay.svelte';
	import type { ValidationData, BasicBuildingBlock } from '../Validation';

	import { SignaturesTypeOptions } from '$lib/pocketbase-types';
	//@ts-ignore
	import JSONTree from 'svelte-json-tree';
	import CopyButton from '$lib/components/copyButton.svelte';
	import { ExclamationCircle, ExclamationTriangle } from 'svelte-heros-v2';

	export let type: SignaturesTypeOptions = SignaturesTypeOptions.xades;
	export let signedFile: SignedFile;
	const { bytes: file } = signedFile;

	enum Indication {
		Failed = 'FAILED',
		Indeterminate = 'INDETERMINATE',
		Passed = 'PASSED'
	}

	let result: ValidationData | undefined = undefined;
	const blocksKey = ['FC', 'ISC', 'VCI', 'XCV', 'CV'] as unknown as keyof BasicBuildingBlock;

	const validate = async () => {
		const validate = await fetch('/api/validateSignature', {
			method: 'POST',
			body: JSON.stringify({ signedDocument: signedFile }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const validateResult = await validate.json();
		result = validateResult;
	};

	const Types = SignaturesTypeOptions;

	const getColor = (type: Indication): 'red' | 'yellow' | 'green' | 'blue' => {
		if (type === Indication.Failed) return 'red';
		if (type === Indication.Indeterminate) return 'yellow';
		if (type === Indication.Passed) return 'green';
		return 'blue';
	};
</script>

{#if !result}
	<div class="flex justify-start mb-4">
		<Button color="primary" on:click={validate}>Validate signature</Button>
	</div>
{/if}
<Tabs>
	<TabItem open title="Signature">
		<div class="flex justify-between items-center mb-4">
			<Heading tag="h4">Signature</Heading>
			<!-- <CopyButton textToCopy={JSON.stringify(signedFile)} /> -->
		</div>
		{#if type === Types.xades}
			<RenderXades {file} />
		{/if}
		{#if type === Types.jades}
			<RenderJades {file} />
		{/if}
		{#if type === Types.pades}
			<RenderPades {file} />
		{/if}
	</TabItem>
	<TabItem title="Json Signature">
		<div class="flex justify-between items-center mb-4">
			<Heading tag="h4">Json Signature</Heading>
			<CopyButton textToCopy={JSON.stringify({type, signedFile})} />
		</div>
		<JSONTree value={{type,signedFile}} />
	</TabItem>
	<TabItem title="Raw Validation Data" disabled={!result}>
		<div class="flex justify-between items-center mb-4">
			<Heading tag="h4">Raw Validation Data</Heading>
			<CopyButton textToCopy={JSON.stringify(result)} />
		</div>
		<JSONTree value={result} />
	</TabItem>
	<TabItem title="Validation Summary" disabled={!result}>
		{#if result}
			{@const basicBuildingBlocks = result.DetailedReport.BasicBuildingBlocks[0]}
			<div class="p-4 w-full !max-w-none">
				<!-- <JSONTree value={basicBuildingBlocks} /> -->
				<div class="flex flex-col gap-4">
					{#each blocksKey as blockKey}
						{@const block = basicBuildingBlocks[blockKey]?.Conclusion}
						{#if block}
							<div class="flex gap-2">
								<Heading tag="h4" class="!w-fit">{blockKey}</Heading>
								<Badge color={getColor(block.Indication)}>{block.Indication}</Badge>
							</div>
							<div class="flex flex-col w-full">
								{#each block.Errors as error}
									<Alert color="red" class="mb-4">
										<ExclamationCircle class="w-20" slot="icon" />
										{error.value}</Alert
									>
								{/each}
								{#each block.Warnings as warning}
									<Alert color="yellow" class="mb-4">
										<ExclamationTriangle class="w-20" slot="icon" />
										{warning.value}
									</Alert>
								{/each}
								{#each block.Infos as information}
									<Alert color="blue" class="mb-4">
										<InformationCircle class="w-20" slot="icon" />
										{information?.value}
									</Alert>
								{/each}
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</TabItem>
</Tabs>
