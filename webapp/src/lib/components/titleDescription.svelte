<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Heading, Hr, P } from 'flowbite-svelte';

	export let title: string;
	export let description: string | null = null;
	export let containerClass: string = '';
</script>

<div class={`flex w-full items-center justify-between ${containerClass}`}>
	<div>
		<Heading
			tag="h2"
			class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-3xl"
			>{title}</Heading
		>
		{#if description}
			<Hr />
			<P class="mt-2 !font-light text-slate-500 dark:text-slate-400 sm:text-lg">{description}</P>
		{/if}
	</div>
	<slot name="actions" />
</div>
