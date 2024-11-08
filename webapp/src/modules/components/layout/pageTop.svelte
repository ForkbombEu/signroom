<div class="bg-background border-b">
	<div class="space-y-6 px-10 py-6">
		<slot />
	</div>
	{#if $$slots.bottom}
		<div class="px-10">
			<slot name="bottom" />
		</div>
	{/if}
</div>
