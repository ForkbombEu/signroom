<script lang="ts">
	import { page } from '$app/stores';
	import { m } from '$lib/i18n';
	import { A, Heading, P } from 'flowbite-svelte';

	type ErrorData = {
		status: number;
		image: string;
		title: string;
		description: string;
	};
	const status = $page.status;
	const data: ErrorData = (() => {
		switch (status) {
			case 404:
				return {
					status: 404,
					image: '/404-computer.svg',
					title: m.Not_Found(),
					description: m.Whoops_That_page_doesnt_exist_()
				};
			case 503:
				return {
					status: 503,
					image: '/maintenance.svg',
					title: m.Service_Unavailable(),
					description: m.Were_temporarily_offline_for_maintenance_Please_try_again_later_()
				};
			default:
				return {
					status: 500,
					image: '/500.svg',
					title: m.Internal_Error(),
					description: m.Something_went_wrong_Please_try_again_later_()
				};
		}
	})();
</script>

<div
	class="flex flex-col gap-4 lg:flex-row max-w-4xl mx-auto min-h-screen pt-20 lg:pt-0 p-8 lg:p-0"
>
	<div class="flex flex-col items-center justify-center w-full">
		<img src={data.image} alt={data.title} />
	</div>
	<div class="flex flex-col items-center justify-center w-full gap-4">
		<Heading tag="h3" class="text-primary-600">{data.status} {data.title}</Heading>
		<Heading tag="h2">{data.description}</Heading>
		{#if status !== 503}
			<div class="w-full pt-8 space-y-1">
				<P class="text-gray-400">{m.Here_are_some_helpful_links()}</P>
				<ul class="flex gap-6">
					<li><A href="/">{m.home()}</A></li>
					<li><A href="/login">{m.login()}</A></li>
					<li><A href="/register">{m.register()}</A></li>
				</ul>
			</div>
		{/if}
	</div>
</div>
