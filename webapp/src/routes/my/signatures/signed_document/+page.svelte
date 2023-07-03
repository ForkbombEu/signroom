<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { page } from '$app/stores';

	let xml: string;
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
			xml = atob(record?.signed_file?.bytes);
		});
</script>

{#if xml}
<div class="overflow-x-scroll w-full h-max">
	<pre>{prettifyXml(xml)}</pre>
	</div>
{:else}
	<p>waiting...</p>
{/if}
