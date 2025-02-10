<script lang="ts">
	import { createTooltip } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	import { cn } from '$lib/viewer/utils/twUtil';

	import LegendIcon from '$lib/viewer/components/icons/LegendIcon.svelte';

	const {
		elements: { trigger: tooltipTrigger, content: tooltipContent },
		states: { open: tooltipOpen }
	} = createTooltip({
		positioning: {
			placement: 'top-start',
			gutter: -3
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true
	});
</script>

<button
	class={cn(
		'bg-sidenav-layer-button text-sidenav-layer-button-text hover:bg-sidenav-layer-button-hover flex size-10 items-center justify-center rounded-full transition-colors',
		$$props.class
	)}
	{...$tooltipTrigger}
	use:tooltipTrigger
	{...$$restProps}
>
	<LegendIcon class="size-5" />
</button>

{#if $tooltipOpen}
	<div
		{...$tooltipContent}
		use:tooltipContent
		transition:fade={{ duration: 100 }}
		class="pointer-events-none z-10 select-none rounded-lg bg-black text-xs shadow-sm"
	>
		<p class="px-2 py-1 text-white">凡例を表示</p>
	</div>
{/if}
