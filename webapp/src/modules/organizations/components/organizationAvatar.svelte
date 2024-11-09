<script lang="ts">
	import Avatar from '@/components/custom/avatar.svelte';
	import { pb } from '@/pocketbase';
	import type { OrganizationsRecord } from '@/pocketbase/types';

	export let organization: OrganizationsRecord;

	$: src = pb.files.getUrl(organization, organization.avatar ?? '');
	$: fallback = organization.name.slice(0, 2);
</script>

<Avatar {src} {fallback} class="rounded-sm" />
