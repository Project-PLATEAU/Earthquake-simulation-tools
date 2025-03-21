<script lang="ts" module>
	import type { LayerConfig, Menu } from '$lib/types/loadedData';
	export interface Props {
		selectedResourceTitles: string[];
		menu: Menu;
		layers: LayerConfig[];
		className?: string;
		selectedLegendTitle: string;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/viewer/utils/twUtil';
	import Content from '$lib/viewer/components/SideNav/LayerList/Content/Content.svelte';

	let {
		selectedResourceTitles = $bindable(),
		menu,
		layers,
		className = '',
		selectedLegendTitle = $bindable()
	}: Props = $props();
</script>

<div class={cn('flex flex-col text-xs', className)}>
	{#each menu as folder}
		<Content {folder} bind:selectedResourceTitles {layers} bind:selectedLegendTitle />
	{/each}
</div>
