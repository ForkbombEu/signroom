<script lang="ts" context="module">
	import type { Link } from '$lib/utils/types';
	import type { Page } from '@sveltejs/kit';

	export type Breadcrumb = Link;
	export type Breadcrumbs = Link[];

	export type BreadcrumbParamRenamer = {
		param: string;
		renamer: (chunk: string) => Promise<string>;
	};
</script>

<script lang="ts">
	import { Effect, pipe, ReadonlyArray as A } from 'effect';
	import { Breadcrumb as BreadcrumbComponent, BreadcrumbItem } from 'flowbite-svelte';
	import { page } from '$app/stores';

	//

	// export let items: Link[] = [];
	// export let homeIcon: any = undefined;
	export let paramRenamers: BreadcrumbParamRenamer[] = [];
	export let exclude: string[] = [];

	//

	$: breadcrumbsPromise = calcBreadcrumbs($page, paramRenamers, exclude);

	async function calcBreadcrumbs(
		page: Page,
		renamers: BreadcrumbParamRenamer[],
		exclude: string[]
	): Promise<Breadcrumbs> {
		const base = calcPageBreadcrumbs(page);
		const renamed = await runParamRenamers(base, page, renamers);
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

	async function runParamRenamers(
		breadcrumbs: Breadcrumbs,
		page: Page,
		paramRenamers: BreadcrumbParamRenamer[]
	): Promise<Breadcrumbs> {
		let newBreadcrumbs: Breadcrumbs = breadcrumbs;
		for (const renamer of paramRenamers) {
			newBreadcrumbs = await runParamRenamer(newBreadcrumbs, page, renamer);
		}
		return newBreadcrumbs;
	}

	function runParamRenamer(
		breadcrumbs: Breadcrumbs,
		page: Page,
		paramRenamer: BreadcrumbParamRenamer
	): Promise<Breadcrumbs> {
		return pipe(
			Effect.fromNullable(page.params[paramRenamer.param]),
			Effect.flatMap((paramValue) =>
				Effect.fromNullable(breadcrumbs.find((b) => b.text == paramValue))
			),
			Effect.flatMap((oldBreadcrumb) =>
				pipe(
					Effect.tryPromise(() => paramRenamer.renamer(oldBreadcrumb.text)),
					Effect.orElseSucceed(() => oldBreadcrumb.text),
					Effect.map((newText) => renameLinkInList(breadcrumbs, oldBreadcrumb.text, newText))
				)
			),
			Effect.orElseSucceed(() => breadcrumbs),
			Effect.runPromise
		);
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
