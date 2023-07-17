<script lang="ts">
	import { Alert, Badge, Button, Heading, P, TabItem, Tabs } from 'flowbite-svelte';
	import RenderJades from './RenderJades.svelte';
	import RenderXades from './RenderXades.svelte';
	import RenderPades from './RenderPades.svelte';
	import type { SignedFile } from './SignedFileDisplay.svelte';
	import type { ValidationData, BasicBuildingBlock } from '../Validation';

	import { SignaturesTypeOptions } from '$lib/pocketbase-types';
	//@ts-ignore
	import JSONTree from 'svelte-json-tree';
	import CopyButton from '$lib/components/copyButton.svelte';
	import { ExclamationCircle, ExclamationTriangle, HandThumbUp } from 'svelte-heros-v2';
	import dayjs from 'dayjs';

	export let type: SignaturesTypeOptions = SignaturesTypeOptions.xades;
	export let signedFile: SignedFile;
	const { bytes: file } = signedFile;

	enum Indication {
		Failed = 'FAILED',
		Indeterminate = 'INDETERMINATE',
		Passed = 'PASSED'
	}

	enum Status {
		NotOk = 'NOT OK',
		Ok = 'OK',
		Warning = 'WARNING'
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
	const getColorByStatus = (status: Status) => {
		if (status === Status.NotOk) return 'red';
		if (status === Status.Ok) return 'green';
		if (status === Status.Warning) return 'yellow';
		return 'blue';
	};
	const getIconByStatus = (status: Status) => {
		if (status === Status.Ok) return HandThumbUp;
		if (status === Status.Warning) return ExclamationTriangle;
		return ExclamationCircle;
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
			<CopyButton textToCopy={JSON.stringify({ type, signedFile })} />
		</div>
		<JSONTree value={{ type, signedFile }} />
	</TabItem>
	{#if !!result}
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
				{@const diagnosticData = result.DiagnosticData}
				<div class="p-4 w-full !max-w-none">
					<div class="flex flex-col gap-4">
						<div class="flex flex-col gap-2">
							<Heading tag="h6">Diagnostic data</Heading>
							<Alert color="blue" class="mb-4">
								<div class="flex items-center">
									<P>ValidationData:</P>
									{dayjs(diagnosticData.ValidationDate).format('DD/MM/YYYY HH:mm:ss')}
								</div>
								<div class="flex items-start">
									<P>Signature:</P>
									<JSONTree value={diagnosticData.Signature} />
								</div>
								<div class="flex items-start">
									<P>Certificate:</P>
									<JSONTree value={diagnosticData.Certificate} />
								</div>
								<div class="flex items-start">
									<P>SignerData:</P>
									<JSONTree value={diagnosticData.SignerData} />
								</div>
							</Alert>
						</div>
						{#each blocksKey as blockKey}
							{@const blockConclusion = basicBuildingBlocks[blockKey]?.Conclusion}
							{@const blockConstraint = basicBuildingBlocks[blockKey]?.Constraint}
							{#if blockConclusion}
								<div class="flex gap-2">
									<Heading tag="h6" class="!w-fit">{blockKey}</Heading>
									<Badge color={getColor(blockConclusion.Indication)}
										>{blockConclusion.Indication}</Badge
									>
								</div>
								{#if blockConstraint}
									{#each blockConstraint as constraint}
										<Alert color={getColorByStatus(constraint.Status)} class="mb-4">
											<svelte:component
												this={getIconByStatus(constraint.Status)}
												class="w-20"
												slot="icon"
											/>
											{constraint.Name.value}
											{constraint.Status}
										</Alert>
									{/each}
								{/if}
								<!-- <div class="flex flex-col w-full">
								{#each blockConclusion.Errors as error}
									<Alert color="red" class="mb-4">
										<ExclamationCircle class="w-20" slot="icon" />
										{error.value}</Alert
									>
								{/each}
								{#each blockConclusion.Warnings as warning}
									<Alert color="yellow" class="mb-4">
										<ExclamationTriangle class="w-20" slot="icon" />
										{warning.value}
									</Alert>
								{/each}
								{#each blockConclusion.Infos as information}
									<Alert color="blue" class="mb-4">
										<InformationCircle class="w-20" slot="icon" />
										{information?.value}
									</Alert>
								{/each}
							</div> -->
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</TabItem>
	{/if}
</Tabs>
