<script lang="ts" module>
	export interface Props {
		data: Data;
		selectedResourceTitles: string[];
		layers: LayerConfig[];
		selectedLegendTitle: string;
	}
</script>

<script lang="ts">
	import type { Data, LayerConfig } from '$lib/types/loadedData';
	import LayerIcon from '$lib/viewer/components/SideNav/LayerList/Content/Layer/LayerIcon/LayerIcon.svelte';
	import { createTooltip } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	import { pickHasLegendLayerIds } from '$lib/utils/LegendUtils';
	import SelectedCheckIcon from '$lib/viewer/components/icons/SelectedCheckIcon.svelte';
	// import LayerLegendSelectButton from './LayerLegendSelectButton/LayerLegendSelectButton.svelte';

	let {
		data,
		selectedResourceTitles = $bindable(),
		layers,
		selectedLegendTitle = $bindable()
	}: Props = $props();

	const {
		elements: { trigger: tooltipTrigger, content: tooltipContent },
		states: { open: tooltipOpen }
	} = createTooltip({
		positioning: {
			placement: 'top-start',
			gutter: -2
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: true
	});

	const hasLegend = pickHasLegendLayerIds(data.id).length > 0;

	// const onClickLegendSelectButton = () => {
	// 	if (hasLegend) {
	// 		selectedLegendTitle = data.title;
	// 	}
	// };
</script>

<label
	class="flex w-full items-center gap-0.5 bg-white p-2 pr-3 transition-colors hover:bg-gray-200"
>
	<SelectedCheckIcon class="group-data-selected:block hidden size-6 text-white" />
	<div class="group-data-selected:hidden block size-6"></div>
	<input
		type="checkbox"
		class="mx-1 max-h-3 min-h-3 min-w-3 max-w-3 rounded-full text-cyan-600 focus:outline-none"
		checked={selectedResourceTitles.includes(data.title)}
		value={data.title}
		onchange={(event) => {
			const inputTitle = event.currentTarget?.value ?? '';
			const checked = event.currentTarget?.checked ?? false;
			if (selectedResourceTitles.includes(inputTitle)) {
				selectedResourceTitles = selectedResourceTitles.filter(
					(title) => title !== inputTitle
				);
				if (hasLegend && selectedLegendTitle === data.title) {
					selectedLegendTitle = '';
				}
			} else {
				if (checked) {
					selectedResourceTitles = [...selectedResourceTitles, inputTitle];
				}
				if (hasLegend) {
					selectedLegendTitle = data.title;
				}
			}
		}}
	/>
	<LayerIcon {data} {layers} />
	<p class=" line-clamp-1 w-full flex-1" {...$tooltipTrigger} use:tooltipTrigger>
		{data.title}
	</p>
	<!-- {#if hasLegend}
		<LayerLegendSelectButton onclick={onClickLegendSelectButton} />
	{/if} -->
</label>

{#if $tooltipOpen}
	<div
		{...$tooltipContent}
		use:tooltipContent
		transition:fade={{ duration: 100 }}
		class="pointer-events-none z-10 -ml-3 select-none rounded-lg bg-black text-xs shadow"
	>
		<p class="px-2 py-1 text-white">{data.title}</p>
	</div>
{/if}
