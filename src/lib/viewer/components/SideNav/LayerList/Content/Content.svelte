<script lang="ts" module>
	export interface Props {
		folder: Folder;
		selectedResourceTitles: string[];
		layers: LayerConfig[];
		selectedLegendTitle: string;
	}
</script>

<script lang="ts">
	import type { Folder, LayerConfig } from '$lib/types/loadedData';
	import Layer from '$lib/viewer/components/SideNav/LayerList/Content/Layer/Layer.svelte';
	import { createCollapsible, createTooltip } from '@melt-ui/svelte';
	import { slide, fade } from 'svelte/transition';

	let {
		folder,
		selectedResourceTitles = $bindable(),
		layers,
		selectedLegendTitle = $bindable()
	}: Props = $props();

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible({
		defaultOpen: true
	});
	const {
		elements: { trigger: tooltipTrigger, content: tooltipContent },
		states: { open: tooltipOpen }
	} = createTooltip({
		positioning: {
			placement: 'top-start',
			gutter: -20
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true
	});
</script>

<div {...$root} use:root>
	<button
		{...$trigger}
		use:trigger
		{...$tooltipTrigger}
		use:tooltipTrigger
		class="flex w-full items-center gap-1 border-b border-l-[10px] border-r border-t border-b-[#3b82f6] border-l-[#3b82f6] border-r-[#e2e8f0] border-t-[#e2e8f0] p-3 text-start transition-colors hover:bg-gray-200"
	>
		<svg viewBox="0 0 576 512" class="size-3">
			<path
				d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"
			/>
		</svg>
		<p class="line-clamp-1">{folder.category}</p>
	</button>
	{#if $open}
		<div
			{...$content}
			use:content
			transition:slide
			class="border-x-2 border-b-2 border-[#e2e8f0]"
		>
			{#each folder.data as resource}
				<Layer
					data={resource}
					bind:selectedResourceTitles
					{layers}
					bind:selectedLegendTitle
				/>
			{/each}
		</div>
	{/if}
</div>

{#if $tooltipOpen}
	<div
		{...$tooltipContent}
		use:tooltipContent
		transition:fade={{ duration: 100 }}
		class="pointer-events-none z-10 ml-5 select-none rounded-lg bg-black text-xs shadow"
	>
		<p class="px-2 py-1 text-white">{folder.category}</p>
	</div>
{/if}
