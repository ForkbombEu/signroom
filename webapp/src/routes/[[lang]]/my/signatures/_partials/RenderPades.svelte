<script lang="ts">
	import { m } from '$lib/i18n';
	export let file: string;
	const getPades = (b64: string) => ({
		type: 'application/pdf',
		data: 'data:application/pdf;base64,' + b64
	});
	const pades = getPades(file);
</script>

<object
	{...pades}
	class="h-[40rem] w-full"
	title={m.pdf_reader()}
	aria-label=""
	aria-labelledby=""
/>
