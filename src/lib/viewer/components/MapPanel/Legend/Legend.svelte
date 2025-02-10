<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	import { getColorParamList, pickHasLegendLayerIds } from '$lib/utils/LegendUtils';

	import CloseIcon from '$lib/viewer/components/icons/CloseIcon.svelte';
	import LegendDropdownIcon from '$lib/viewer/components/icons/LegendDropdownIcon.svelte';

	const { selectedLegendTitle, selectedLegendLayerIds, closeLegend } = $props<{
		selectedLegendTitle: string;
		selectedLegendLayerIds: string[];
		closeLegend: () => void;
	}>();

	const handleCloseClick = (e: MouseEvent) => {
		//selectedLegendTitle = '';
		closeLegend();
		e.stopPropagation();
	};

	let hasLegendLayerIds: string[] = $state([]);

	$effect(() => {
		hasLegendLayerIds = pickHasLegendLayerIds(selectedLegendLayerIds);
	});

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible({
		defaultOpen: true
	});
</script>

{#if selectedLegendTitle && hasLegendLayerIds.length > 0}
	<div {...$root} use:root class="relative flex flex-col gap-0 bg-white shadow-lg">
		<button
			{...$trigger}
			use:trigger
			type="button"
			class="inline-flex w-max cursor-pointer flex-row items-center justify-between gap-4 rounded-lg border bg-white px-5 py-3 text-base shadow-sm"
		>
			<span>{selectedLegendTitle}</span>
			<LegendDropdownIcon class="h-auto w-4" />
		</button>
		<button
			onclick={handleCloseClick}
			class="absolute -right-3 -top-3 cursor-pointer rounded-full bg-white p-0.5 shadow-md"
		>
			<CloseIcon class="size-6 text-gray-600" />
		</button>
		{#if $open}
			<div
				{...$content}
				use:content
				transition:slide
				class="mt-2 inline-flex flex-col gap-1 rounded-lg border bg-white px-5 py-3 text-base shadow-sm"
			>
				{#each hasLegendLayerIds as layerId}
					{#each getColorParamList(layerId) as entry}
						<div class="flex items-center gap-2">
							<div
								class="h-3 w-3"
								style={`background-color: rgb(${entry.color[0]} ${entry.color[1]} ${entry.color[2]})`}
							></div>
							<p>{entry.name}</p>
						</div>
					{/each}
				{/each}
			</div>
		{/if}
	</div>
{/if}
