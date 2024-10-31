<script lang="ts" generics="C extends CollectionName">
	import type { CollectionResponses } from '@/pocketbase/types';
	import { Array } from 'effect';
	import { Checkbox } from '@/components/ui/checkbox';
	import { getCollectionManagerContext } from '../collectionManagerContext';
	import type { CollectionName } from '@/pocketbase/collections-models/types';

	export let record: CollectionResponses[C];

	let { selectionContext: selection } = getCollectionManagerContext();
	let { selectedRecords } = selection;

	$: checked = $selectedRecords.includes(record.id);

	function handleChecked(checked: boolean | 'indeterminate') {
		if (checked == 'indeterminate') return;
		if (checked) $selectedRecords = [...$selectedRecords, record.id];
		else $selectedRecords = Array.remove($selectedRecords, $selectedRecords.indexOf(record.id));
	}
</script>

<Checkbox {checked} onCheckedChange={handleChecked} value={record.id} name="select" />
