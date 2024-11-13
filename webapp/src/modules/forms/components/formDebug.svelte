<script lang="ts" context="module">
	import type { GenericRecord } from '@/utils/types';
</script>

<script lang="ts" generics="T extends GenericRecord">
	import SuperDebug, { type SuperForm } from 'sveltekit-superforms';

	export let form: SuperForm<T>;
	const { form: formData } = form;
</script>

<SuperDebug data={$formData}></SuperDebug>
