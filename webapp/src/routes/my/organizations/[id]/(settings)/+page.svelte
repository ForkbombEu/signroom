<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { page } from '$app/stores';
</script>

<A href={`${$page.url.pathname}/services`}>Services</A>
