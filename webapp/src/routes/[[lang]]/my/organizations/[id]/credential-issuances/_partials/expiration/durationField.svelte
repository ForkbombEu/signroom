<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { m } from '$lib/i18n';
	import type { Duration } from 'date-fns';
	import { Input, Label } from 'flowbite-svelte';

	export let duration: Duration = {
		years: 0,
		months: 0,
		days: 0
	};

	let internal: Duration = duration;

	const input = (x: Duration) => (internal = parseDuration(x));
	const output = (x: Duration) => (duration = parseDuration(x));

	$: input(duration);
	$: output(internal);

	function parseDuration(duration: Duration): Duration {
		const d: Duration = {};
		for (const [k, v] of Object.entries(duration)) {
			d[k as keyof Duration] = Number(v);
		}
		return d;
	}
</script>

<div>
	<Label>{m.Years()}</Label>
	<Label>{m.Months()}</Label>
	<Label>{m.Days()}</Label>

	<Input type="number" min={0} bind:value={internal.years} />
	<Input type="number" min={0} bind:value={internal.months} />
	<Input type="number" min={0} bind:value={internal.days} />
</div>

<style lang="postcss">
	div {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto auto;
		@apply gap-2;
	}
</style>
