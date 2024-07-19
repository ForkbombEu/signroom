<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Collections } from '$lib/pocketbase/types';
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable,
		EditRecord
	} from '$lib/collectionManager';
</script>

<CollectionManager collection={Collections.Services} let:records>
	<CollectionManagerHeader />
	<CollectionTable {records}></CollectionTable>
</CollectionManager>
