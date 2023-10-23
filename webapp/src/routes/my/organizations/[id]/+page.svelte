<script lang="ts">
	import { A, Heading, Hr, P, List, Li } from 'flowbite-svelte';
	import { page } from '$app/stores';

	export let data;
	let { organization, services } = data;

	$: servicesInView = services.slice(0, 4);
</script>

<Heading tag="h3">{organization.name}</Heading>

<Hr />

<div class="flex justify-between">
	<div class="flex space-x-8">
		<div
			class="flex flex-col items-center bg-primary-50 rounded-lg border-primary-300 border w-fit p-6"
		>
			<Heading tag="h3" class="w-fit" color="text-primary-600">{services.length}</Heading>
			<P color="text-primary-600">active service</P>
		</div>

		<div>
			<P>Latest services</P>
			{#if servicesInView.length}
				<List>
					{#each servicesInView as s}
						<Li>
							<A href={`${$page.url.pathname}/services/${s.id}`}>{s.name}</A>
						</Li>
					{/each}
				</List>
			{/if}
		</div>
	</div>

	<div>
		<A href={`${$page.url.pathname}/services`}>→ View all services</A>
	</div>
</div>
