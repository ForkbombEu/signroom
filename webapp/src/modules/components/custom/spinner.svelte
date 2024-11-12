<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Moon } from 'svelte-loading-spinners';

	type $$Props = ComponentProps<Moon>;

	export let size: $$Props['size'] = 40;
	export let color: $$Props['color'] = 'black';
</script>

<Moon {size} {color} {...$$props} />
