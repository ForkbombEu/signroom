<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { CollectionForm } from '@/collections-components';
	import FormDebug from '@/forms/components/formDebug.svelte';
	import { toast } from 'svelte-sonner';

	export let data;
</script>

<CollectionForm
	collection="z_test_collection"
	recordId={data.record.id}
	initialData={data.record}
	let:form
	onSuccess={(record) => {
		toast.success(JSON.stringify(record));
		invalidateAll();
	}}
>
	<FormDebug {form} />
</CollectionForm>
