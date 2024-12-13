<script lang="ts">
	import { assets } from '$app/paths';
	import Icon from '$lib/components/icon.svelte';
	import PageCard from '$lib/components/pageCard.svelte';
	import { m } from '$lib/i18n/index.js';
	import { generateIssuanceFlowQr } from '$lib/issuanceFlows/utils.js';
	import { links } from '$lib/links.js';
	import { generateQr } from '$lib/qrcode/index.js';
	import { String } from 'effect';
	import { Button, Heading } from 'flowbite-svelte';
	import { ArrowTopRightOnSquare } from 'svelte-heros-v2';

	export let data;
	$: flow = data.issuanceFlow;

	const appsQr = generateQr(links.didroom_apps);
	$: flowQr = generateIssuanceFlowQr({
		type_name: flow.type_name,
		credential_issuer_url: flow.credential_issuer,
		authorization_server_url: flow.authorization_server
	});
</script>

<div class="flex h-screen w-screen flex-col justify-stretch bg-slate-50">
	<div class="flex items-center justify-center border-b p-4 shadow-xl">
		<img src="{assets}/DIDroom_logo_trim.png" class="h-8" alt={m.DIDroom_logo()} />
	</div>
	<div
		class="flex grow items-center justify-center gap-8 bg-slate-200 p-8 portrait:flex-col print:gap-4 print:p-4"
	>
		<PageCard class="max-w-[450px] !space-y-4 !p-4 landscape:grow landscape:basis-1 print:border">
			<Heading tag="h6" class="font-medium">{m.First_step()}</Heading>

			<div class="flex items-center gap-2 text-sm">
				<img
					src="{assets}/app-didroom.svg"
					alt={m.DIDroom_Wallet_App_logo()}
					class="size-12 rounded-lg print:size-[2cm]"
				/>
				<p>{@html m.Download_DIDroom_Wallet_App()}</p>
			</div>

			<div class="flex items-center gap-4 rounded-md bg-slate-50 p-4 pt-3 print:border">
				<div>
					<p class="text-lg font-semibold leading-tight">{m.Download_DIDroom_Wallet()}</p>
					<p class="mb-3 mt-1 text-sm text-gray-700">
						{m.Scan_this_QR_and_download_DIDroom_Wallet()}
					</p>
					<Button outline size="sm" class="print:hidden">
						{m.Download_link()}
						<Icon src={ArrowTopRightOnSquare} ml />
					</Button>
				</div>
				<img
					src={appsQr}
					alt={m.Mobile_app_QR_code()}
					class="aspect-square h-auto w-32 rounded-lg border"
				/>
			</div>
		</PageCard>

		<PageCard
			class="hidden grow basis-1 flex-row items-center justify-center gap-4 !space-y-4 !p-4 portrait:self-stretch print:flex print:border-4 print:border-black"
		>
			<div
				class="flex items-center justify-center gap-2 self-stretch rounded-lg border bg-slate-100 p-4"
			>
				<img src={flowQr} alt={m.Service_Qr_Code()} class="size-60 rounded-lg border" />
			</div>

			<div class="space-y-4">
				<div class="flex flex-col items-center gap-2">
					<div class="flex items-center gap-3">
						<d-avatar name={flow.display_name} src={flow.logo} size="lg" shape="square" />
						<p class="text-lg font-semibold">{flow.display_name}</p>
					</div>
					<p class="text-sm text-gray-500">{flow.organization}</p>
				</div>

				<div class="max-w-[450px] space-y-3 rounded-md border bg-slate-50 p-3">
					{#if String.isNonEmpty(flow.description)}
						<p class="text-sm">{@html flow.description}</p>
					{/if}

					<div class="flex items-center gap-4">
						<d-avatar
							name={flow.organization}
							src={flow.organization_logo}
							size="lg"
							shape="square"
						/>
						<div>
							<p class="font-semibold">{flow.organization}</p>
							{#if String.isNonEmpty(flow.organization_description)}
								<p class="text-xs">{@html flow.organization_description}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</PageCard>

		<PageCard
			class="flex grow basis-1 flex-col items-center !space-y-4 !p-4 portrait:self-stretch print:hidden"
		>
			<div class="flex flex-col items-center gap-2 py-4">
				<div class="flex items-center gap-3">
					<d-avatar name={flow.display_name} src={flow.logo} size="lg" shape="square" />
					<p class="text-lg font-semibold">{flow.display_name}</p>
				</div>
				<p class="text-sm text-gray-500">{flow.organization}</p>
			</div>

			<div class="flex flex-col items-center gap-2 self-stretch rounded-lg border bg-slate-100 p-4">
				<img src={flowQr} alt={m.Service_Qr_Code()} class="size-60 rounded-lg border" />
			</div>

			<div class="max-w-[450px] space-y-3 rounded-md border bg-slate-50 p-3">
				{#if String.isNonEmpty(flow.description)}
					<p class="text-sm">{@html flow.description}</p>
				{/if}

				<div class="flex items-center gap-4">
					<d-avatar
						name={flow.organization}
						src={flow.organization_logo}
						size="lg"
						shape="square"
					/>
					<div>
						<p class="font-semibold">{flow.organization}</p>
						{#if String.isNonEmpty(flow.organization_description)}
							<p class="text-xs">{@html flow.organization_description}</p>
						{/if}
					</div>
				</div>
			</div>
		</PageCard>

		<PageCard class="max-w-[450px] !space-y-4 !p-4 landscape:grow landscape:basis-1 print:border">
			<Heading tag="h6" class="font-medium">{m.What_to_do_next_()}</Heading>

			<div class="flex items-center gap-2 text-sm">
				<img
					src="{assets}/app-didroom.svg"
					alt={m.DIDroom_Wallet_App_logo()}
					class="size-12 rounded-lg"
				/>
				<p>{@html m.Open_DIDroom_wallet_App()}</p>
			</div>

			<div class="flex gap-4 rounded-md bg-slate-50 p-4 pt-3 print:border">
				<div>
					<p class="text-lg font-semibold leading-tight">
						{m.Scan_with_Wallet_App_for_Credential_Retrieval()}
					</p>
					<p class="mb-3 mt-1 text-sm text-gray-700">
						{m.Use_the_Wallet_app_to_easily_retrieve_your_credential_by_scanning_this_QR_code_()}
					</p>
					<Button outline size="sm" class="print:hidden">
						{m.Help_me()}
						<Icon src={ArrowTopRightOnSquare} ml />
					</Button>
				</div>
			</div>
		</PageCard>
	</div>
</div>
