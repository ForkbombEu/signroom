<script lang="ts" context="module">
	import type { Link } from '$lib/utils/types';
	import type { Page } from '@sveltejs/kit';

	export type Breadcrumb = Link;
	export type Breadcrumbs = Link[];

	export type BreadcrumbRenamer = {
		sveltekitFolder: string;
		newText: ((chunk: string) => Promise<string> | string) | string;
	};
</script>

<script lang="ts">
	import { Breadcrumb as BreadcrumbComponent, BreadcrumbItem } from 'flowbite-svelte';
	import { page } from '$app/stores';

	//

	// export let items: Link[] = [];
	// export let homeIcon: any = undefined;
	export let renamers: BreadcrumbRenamer[] = [];
	export let exclude: string[] = [];

	//

	$: breadcrumbsPromise = calcBreadcrumbs($page, renamers, exclude);

	async function calcBreadcrumbs(
		page: Page,
		renamers: BreadcrumbRenamer[],
		exclude: string[]
	): Promise<Breadcrumbs> {
		const base = calcPageBreadcrumbs(page);
		const sveltekitRouteChunkList = getPathChunkList(page.route.id!);
		const renamed = await runRenamers(base, sveltekitRouteChunkList, renamers);
		const removed = removeBreadcrumbFromList(renamed, exclude);
		return removed;
	}

	/* Base calculation */

	function getPathChunkList(pathname: string): string[] {
		return pathname.split('/').filter((chunk) => Boolean(chunk));
	}

	function getChunkUrl(chunks: string[], chunk: string): string {
		const chunkIndex = chunks.indexOf(chunk);
		return '/' + chunks.slice(0, chunkIndex + 1).join('/');
	}

	function calcPageBreadcrumbs(page: Page): Breadcrumbs {
		const chunks = getPathChunkList(page.url.pathname);
		const chunksUrls = chunks.map((chunk) => getChunkUrl(chunks, chunk));
		const breadcrumbs: Breadcrumbs = chunks.map((c, i) => ({ text: c, href: chunksUrls[i] }));
		return breadcrumbs;
	}

	/* Removing */

	function removeBreadcrumbFromList(
		breadcrumbList: Breadcrumbs,
		excludeList: string[]
	): Breadcrumbs {
		return breadcrumbList.filter((b) => !excludeList.includes(b.text));
	}

	/* Renaming */

	async function runRenamers(
		breadcrumbs: Breadcrumbs,
		sveltekitRouteChunkList: string[],
		renamers: BreadcrumbRenamer[]
	): Promise<Breadcrumbs> {
		let newBreadcrumbs: Breadcrumbs = breadcrumbs;
		for (const renamer of renamers) {
			newBreadcrumbs = await runRenamer(newBreadcrumbs, sveltekitRouteChunkList, renamer);
		}
		return newBreadcrumbs;
	}

	async function runRenamer(
		breadcrumbs: Breadcrumbs,
		sveltekitRouteChunkList: string[],
		renamer: BreadcrumbRenamer
	): Promise<Breadcrumbs> {
		if (breadcrumbs.length != sveltekitRouteChunkList.length) return breadcrumbs;
		const { newText, sveltekitFolder } = renamer;

		const sveltekitChunkIndex = sveltekitRouteChunkList.indexOf(sveltekitFolder);
		if (sveltekitChunkIndex === -1) return breadcrumbs;

		const oldBreadcrumbText = breadcrumbs[sveltekitChunkIndex].text;

		const finalText = await evaluateRenamerNewText(oldBreadcrumbText, renamer.newText);
		return renameLinkInList(breadcrumbs, oldBreadcrumbText, finalText);
	}

	async function evaluateRenamerNewText(
		oldText: string,
		newText: BreadcrumbRenamer['newText']
	): Promise<string> {
		try {
			if (typeof newText == 'string') return newText;
			else return await newText(oldText);
		} catch (e) {
			return oldText;
		}
	}

	function renameLinkInList(linkList: Link[], oldText: string, newText: string): Link[] {
		return linkList.map((b) => (b.text == oldText ? renameLink(b, newText) : b));
	}

	function renameLink(link: Link, newText: string): Link {
		return { ...link, text: newText };
	}
</script>

{#await breadcrumbsPromise then breadcrumbs}
	<BreadcrumbComponent aria-label="breadcrumb">
		{#each breadcrumbs as { href, text }, i}
			{@const isHomeBreadcrumb = i == 0}
			<BreadcrumbItem home={isHomeBreadcrumb} {href}>{text}</BreadcrumbItem>
		{/each}
	</BreadcrumbComponent>
{/await}
