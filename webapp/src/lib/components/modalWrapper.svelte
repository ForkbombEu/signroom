<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import { Modal } from 'flowbite-svelte';

	import PortalWrapper from './portalWrapper.svelte';
	import { createToggleStore } from './utils/toggleStore';
	import type { ComponentProps } from 'svelte';

	export let title: string | undefined = undefined;
	export let size: ComponentProps<Modal>['size'] = 'sm';

	const show = createToggleStore(false);
</script>

<slot openModal={show.on} closeModal={show.off} />

<PortalWrapper>
	<Modal {size} {title} bind:open={$show}>
		<slot name="modal" openModal={show.on} closeModal={show.off} />
	</Modal>
</PortalWrapper>
