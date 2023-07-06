<script lang="ts">
	import FieldError from './fieldError.svelte';
	import FieldLabel from './fieldLabel.svelte';

	export let field: string;
	export let label = '';
</script>

<div class="space-y-2">
	<FieldLabel {field} text={label} />
	<slot />
	<FieldError {field} />
</div>
