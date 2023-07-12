<script lang="ts">
	import RecordSearch from '$lib/components/recordSearch.svelte';
	import RecordSelect from '$lib/components/recordSelect.svelte';
	import RelationsManager from '$lib/components/relationsManager.svelte';
	import { Collections } from '$lib/pocketbase-types';
	import { Heading, Hr } from 'flowbite-svelte';

	export let relation: string;
	export let relations: string[] = [];
</script>

<div class="">
	<div class="p-8 space-y-2">
		<Heading tag="h4">Relation - Single - Select</Heading>
		<RelationsManager collection={Collections.Features} bind:relation displayFields={['name']} />
	</div>

	<div class="p-8 space-y-2">
		<Heading tag="h4">Relation - Single - Search</Heading>
		<RelationsManager
			bind:relation
			mode="select"
			collection={Collections.Features}
			displayFields={['name']}
		/>
	</div>

	<Hr />

	<div class="p-8 space-y-2">
		<Heading tag="h4">Relation - Multiple - Select</Heading>
		<RelationsManager
			bind:relation={relations}
			collection={Collections.Features}
			displayFields={['name']}
			multiple
		/>
	</div>

	<div class="p-8 space-y-2">
		<Heading tag="h4">Relation - Multiple - Search</Heading>
		<RelationsManager
			bind:relation={relations}
			mode="select"
			collection={Collections.Features}
			displayFields={['name']}
			multiple
		/>
	</div>

	<Hr />

	<div class="p-8 space-y-8">
		<Heading tag="h4">Record management</Heading>

		<RecordSelect
			collection={Collections.Features}
			displayFields={['name']}
			name="features"
			on:select={(d) => {
				console.log(d);
			}}
		/>

		<RecordSearch
			collection={Collections.Features}
			name="features"
			on:select={(d) => {
				console.log(d);
			}}
		/>
	</div>
</div>
