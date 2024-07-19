<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Collections } from '$lib/pocketbase/types';
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
</script>

<CollectionManager collection={Collections.Templates} let:records>
	<CollectionManagerHeader />
	<CollectionTable fields={['name', 'description', 'credential_type', 'organization']} {records}
	></CollectionTable>
</CollectionManager>
