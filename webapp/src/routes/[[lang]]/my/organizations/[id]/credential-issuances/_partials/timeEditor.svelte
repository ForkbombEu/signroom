<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import {
		getLabels,
		timeToTimeData,
		type TimeMode,
		timeDataToTime,
		type TimeData
	} from './timeEditorUtils';

	export let time: number;
	export let mode: TimeMode = 'duration';

	//

	$: timeData = timeToTimeData(time, mode);
	$: updateTime(timeData, mode);

	function updateTime(timeData: TimeData, mode: TimeMode) {
		time = timeDataToTime(timeData, mode);
	}

	//

	let labels = getLabels(mode);
</script>

<div class="grid grid-cols-3 grid-rows-2 gap-2">
	<div class="text-sm">{labels.y}</div>
	<div class="text-sm">{labels.m}</div>
	<div class="text-sm">{labels.d}</div>
	<div>
		<Input type="number" bind:value={timeData.y} />
	</div>
	<div>
		<Input type="number" bind:value={timeData.m} />
	</div>
	<div>
		<Input type="number" bind:value={timeData.d} />
	</div>
</div>
