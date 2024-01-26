import { writable } from 'svelte/store';
import type { Link } from './types';
import type { Page } from '@sveltejs/kit';

//

export const breadcrumbsStore = writable<Link[]>([]);

export function resetBreadcrumbsStore(page: Page) {
	breadcrumbsStore.set(calcPageBreadcrumbs(page));
}

export function renameBreadcrumbInStore(oldText: string, newText: string) {
	breadcrumbsStore.update((breadcrumbList) =>
		renameBreadcrumbInList(breadcrumbList, oldText, newText)
	);
}

//

function getPathChunkList(pathname: string): string[] {
	return pathname.split('/').filter((chunk) => Boolean(chunk));
}

function getChunkUrl(chunks: string[], chunk: string): string {
	const chunkIndex = chunks.indexOf(chunk);
	return '/' + chunks.slice(0, chunkIndex + 1).join('/');
}

function calcPageBreadcrumbs(page: Page): Link[] {
	const chunks = getPathChunkList(page.url.pathname);
	const chunksUrls = chunks.map((chunk) => getChunkUrl(chunks, chunk));
	const breadcrumbs: Link[] = chunks.map((c, i) => ({ text: c, href: chunksUrls[i] }));
	return breadcrumbs;
}

function renameBreadcrumbInList(breadcrumbList: Link[], oldText: string, newText: string): Link[] {
	return breadcrumbList.map((b) => (b.text == oldText ? renameBreadcrumb(b, newText) : b));
}

function renameBreadcrumb(breadcrumb: Link, newText: string): Link {
	return { ...breadcrumb, text: newText };
}
