<script>
	import { portal } from './utils/portal';

	export let target = 'body';
</script>

<div use:portal={target} class="fixed z-50 m-0 p-0">
	<slot />
</div>
