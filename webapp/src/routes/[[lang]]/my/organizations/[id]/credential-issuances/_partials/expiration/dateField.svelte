<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import dayjs from 'dayjs';
	import { DateInput } from 'date-picker-svelte';
	import { Label } from 'flowbite-svelte';
	import { m } from '$lib/i18n';

	export let date: number;

	let internal: Date = new Date();

	const input = (x: number) => (internal = new Date(x * 1000));
	const output = (x: Date) => (date = dayjs(x).unix());

	$: input(date);
	$: output(internal);

	const format = 'yyyy-MM-dd HH:mm';
	const min = new Date();
	const max = dayjs(min).add(10, 'years').toDate();
</script>

<div class="space-y-2">
	<Label>{m.Date()}</Label>
	<DateInput {min} {max} {format} bind:value={internal} />
</div>

<style>
	:global(.date-time-field > input) {
		width: 200px !important;
		height: 42px;
	}
</style>
