<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Collections, type IssuersResponse } from '$lib/pocketbase/types';
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
	import { createTypeProp } from '$lib/utils/typeProp';

	const recordType = createTypeProp<IssuersResponse>();
</script>

<CollectionManager {recordType} collection={Collections.Issuers} let:records>
	<CollectionManagerHeader />
	<CollectionTable {records} fields={['name', 'endpoint']}></CollectionTable>
</CollectionManager>
