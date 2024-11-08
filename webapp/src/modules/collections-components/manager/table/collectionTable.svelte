<script lang="ts" generics="T extends CollectionResponses[CollectionName]">
	import { m } from '@/i18n';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import type { CollectionResponses } from '@/pocketbase/types';
	import {
		RecordDelete,
		RecordEdit,
		RecordSelect,
		RecordShare,
		type RecordAction
	} from '../record-actions';
	import type { KeyOf } from '@/utils/types';
	import * as Table from '@/components/ui/table';
	import FieldTh from './fieldTh.svelte';
	import IconButton from '@/components/custom/iconButton.svelte';

	export let records: T[];
	export let fields: KeyOf<T>[] = ['id'] as KeyOf<T>[];
	export let hide: Array<RecordAction> = [];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row class="hover:bg-inherit">
			{#if !hide.includes('select')}
				<Table.Head />
			{/if}

			{#each fields as field}
				<FieldTh {field} />
			{/each}

			<slot name="header" Th={Table.Head} />

			<Table.Head>
				{m.Actions()}
			</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each records as record}
			<Table.Row class="hover:bg-inherit">
				{#if !hide.includes('select')}
					<Table.Cell class="py-2">
						<RecordSelect {record} />
					</Table.Cell>
				{/if}

				{#each fields as field}
					<Table.Cell>
						{record[field]}
					</Table.Cell>
				{/each}

				<slot name="row" {record} Td={Table.Cell} />

				<Table.Cell class="py-2">
					<slot name="actions" {record} />

					{#if !hide.includes('edit')}
						<RecordEdit {record}>
							<svelte:fragment slot="trigger" let:builder let:icon>
								<IconButton {icon} variant="ghost" builders={[builder]} />
							</svelte:fragment>
						</RecordEdit>
					{/if}
					{#if !hide.includes('share')}
						<RecordShare {record}>
							<svelte:fragment slot="trigger" let:builder let:icon>
								<IconButton {icon} variant="ghost" builders={[builder]} />
							</svelte:fragment>
						</RecordShare>
					{/if}
					{#if !hide.includes('delete')}
						<RecordDelete {record}>
							<svelte:fragment slot="trigger" let:builder let:icon>
								<IconButton {icon} variant="ghost" builders={[builder]} />
							</svelte:fragment>
						</RecordDelete>
					{/if}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
