<div class="shrink-0 border-b">
	<div class="flex items-center justify-between px-3 py-2">
		<div class="shrink-0 items-center">
			<slot name="left" />
		</div>
		<div class="flex items-center justify-center gap-2">
			<slot name="center" />
		</div>
		<div class="flex shrink-0 items-center">
			<slot name="right" />
		</div>
	</div>
</div>

<!-- 
	@component 

	### Slots
	- left - the left side of the navbar
	- center - the center of the navbar
	- right - the right side of the navbar
	
-->
