<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { getCertificate } from '$lib/certificates/storage';
	import { Button } from 'flowbite-svelte';
	import { CheckBadge } from 'svelte-heros-v2';
	import * as x509 from '@peculiar/x509';
	import Icon from '$lib/components/icon.svelte';
	import { downloadBlob } from '$lib/utils/clientFileDownload';
	import CopyButton from '$lib/components/copyButton.svelte';

	export let certificateName: string;
	const rawCertificate = getCertificate(certificateName);
	const cert = new x509.X509Certificate(rawCertificate?.certificate.value);
	const key = rawCertificate?.key.value;
</script>

<span>Certificate Name</span>
<strong class="font-bold">{certificateName}</strong>

<br />

<Button on:click={() => downloadBlob(new Blob([cert.toString('pem')]), certificateName + '.pem')}>
	Download PEM
	<Icon src={CheckBadge} ml></Icon>
</Button>

<hr />

<div class="py-4 font-mono">
	<span class="font-semibold">Private key</span>
	<pre class="mt-3 gap-2">{key}
		<div class="flex flex-col items-end pt-4">
			<CopyButton textToCopy={key}>Copy to clipboard</CopyButton>
		</div>
	</pre>
</div>
