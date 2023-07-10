<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { page } from '$app/stores';
	import { Button } from 'flowbite-svelte';

	let xml: string;
	let file: any;
	let result: any;
	const url = $page.url;
	const recordId = url.searchParams.get('id');

	const prettifyXml = (sourceXml: string) => {
		const xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
		const xsltDoc = new DOMParser().parseFromString(
			[
				'<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
				'  <xsl:strip-space elements="*"/>',
				'  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
				'    <xsl:value-of select="normalize-space(.)"/>',
				'  </xsl:template>',
				'  <xsl:template match="node()|@*">',
				'    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
				'  </xsl:template>',
				'  <xsl:output indent="yes"/>',
				'</xsl:stylesheet>'
			].join('\n'),
			'application/xml'
		);

		const xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(xsltDoc);
		const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
		const resultXml = new XMLSerializer().serializeToString(resultDoc);
		return resultXml;
	};

	if (!recordId) throw new Error('No record id');
	pb.collection('signatures')
		.getOne(recordId)
		.then((record) => {
			if (!record) throw new Error('No record');
			if (!record?.signed_file) throw new Error('No signed file');
			file = record?.signed_file;
			xml = atob(record?.signed_file?.bytes);
		});

	// console.log('xml', xml, file);

	const validate = async () => {
		const validate = await fetch('/api/validateSignature', {
			method: 'POST',
			body: JSON.stringify({ signedDocument: file }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const validateResult = await validate.json();

		result = validateResult;
	};
</script>

{#if xml}
	<div class="flex flex-col gap-8 justify-end">
		<div class="overflow-x-scroll w-full h-max">
			<pre>{prettifyXml(xml)}</pre>
		</div>
		{#if result}
			<div class="overflow-x-scroll w-full h-max">
				<pre>{JSON.stringify(result, null, 2)}</pre>
			</div>
		{/if}
		<div class="flex flex-row gap-4">
			<Button color="primary" on:click={validate}>Validate signature</Button>
		</div>
	</div>
{:else}
	<p>waiting...</p>
{/if}
