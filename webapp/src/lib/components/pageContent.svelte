<!--
SPDX-FileCopyrightText: 2024 The Forkbomb Company

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
	import clsx from 'clsx';

	//

	export let layout: 'vertical' | 'horizontal' = 'vertical';

	let className = '';
	export { className as class };

	//

	$: classes = clsx('px-10 py-8', className, {
		'flex items-start gap-8': layout == 'horizontal',
		'space-y-8': layout == 'vertical'
	});
</script>

<div class={classes}>
	<slot />
</div>
