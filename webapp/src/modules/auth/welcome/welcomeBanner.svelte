<script>
	import { m } from '@/i18n';
	import { appTitle } from '@/utils/strings';
	import Alert from '@/components/custom/alert.svelte';
	import T from '@/components/custom/t.svelte';

	let className = '';
	export { className as class };
</script>

<Alert variant="warning" class="space-y-3 {className}">
	<T tag="h2" class="-rotate-2 text-ellipsis text-balance text-center">
		{m.welcome_to_app({ appName: appTitle })}
	</T>

	<slot />
</Alert>
