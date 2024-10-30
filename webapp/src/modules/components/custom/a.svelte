<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type $$Props = HTMLAnchorAttributes & { href: string };

	export let href: $$Props['href'];
</script>

<a {href} {...$$restProps}>
	<slot />
</a>

<style lang="postcss">
	a {
		@apply text-primary hover:underline;
	}
</style>
