<script lang="ts">
	export let file: string;
	const getPades = (b64: string) => ({
		type: 'application/pdf',
		data: 'data:application/pdf;base64,' + b64
	});
	const pades = getPades(file);
</script>

<object {...pades} class="w-full h-[40rem]" />
