<script lang="ts">
	import { createTooltip, type CreateTooltipProps } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	import { cn } from '$lib/viewer/utils/twUtil';

	export let tooltipText: string;
	export let tooltipProps: CreateTooltipProps = {};
	const {
		elements: { trigger: tooltipTrigger, content: tooltipContent },
		states: { open: tooltipOpen }
	} = createTooltip({
		positioning: {
			placement: 'right',
			gutter: 18,
			...tooltipProps.positioning
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: true,
		...tooltipProps
	});
</script>

<button
	{...$$restProps}
	class={cn('cursor-pointer', $$restProps.class)}
	{...$tooltipTrigger}
	use:tooltipTrigger
>
	<slot />
</button>

{#if $tooltipOpen}
	<div
		{...$tooltipContent}
		use:tooltipContent
		transition:fade={{ duration: 100 }}
		class="pointer-events-none z-10 -ml-3 select-none rounded-lg bg-black text-xs shadow-sm"
	>
		<p class="px-2 py-1 text-white">{tooltipText}</p>
	</div>
{/if}
