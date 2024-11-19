<script lang="ts" generics="C extends CollectionName">
	import Icon from '@/components/custom/icon.svelte';
	import type { CollectionRecords } from '@/pocketbase/types';
	import { m } from '@/i18n';
	import {
		type OnCollectionFormSuccess,
		type CollectionFormOptions
	} from '@/collections-components/form/formOptions';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import { Button } from '@/components/ui/button';
	import { createToggleStore } from '@/components/custom/utils';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import { CollectionForm } from '@/collections-components';
	import { Plus } from 'lucide-svelte';
	import Sheet from '@/components/custom/sheet.svelte';
	import { merge } from 'lodash';

	//

	export let collection: C | undefined = undefined;
	collection;

	export let initialData: Partial<CollectionRecords[C]> | undefined = undefined;
	export let sheetTitle: string | undefined = undefined;

	export let onSuccess: OnCollectionFormSuccess<C> = () => {};

	//

	const show = createToggleStore(false);

	const { collection: c, formsOptions } = getCollectionManagerContext();
	const collectionName: C = c as C; // ts-fix

	const title = sheetTitle ?? m.Create_record();

	const options: CollectionFormOptions<C> = merge({}, formsOptions.base, formsOptions.create, {
		uiOptions: { submitButtonText: title, triggerToast: true }
	} as CollectionFormOptions<C>);

	const handleSuccess: OnCollectionFormSuccess<C> = (record) => {
		show.off();
		onSuccess(record, 'create');
	};
</script>

<Sheet bind:open={$show} {title}>
	<svelte:fragment slot="trigger" let:builder>
		<Button builders={[builder]} class="shrink-0">
			<Icon src={Plus} mr />
			<slot>
				{title}
			</slot>
		</Button>
	</svelte:fragment>

	<svelte:fragment slot="content">
		<CollectionForm
			{initialData}
			collection={collectionName}
			{...options}
			onSuccess={handleSuccess}
		/>
	</svelte:fragment>
</Sheet>
