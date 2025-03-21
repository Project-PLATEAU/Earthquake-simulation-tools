<script lang="ts">
	import { createSlider, melt } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';
	import { cn } from '$lib//viewer/utils/twUtil';
	import type { LayerConfig } from '$lib/types/loadedData';
	import { makeTempLayers } from '$lib/viewer/utils/tempLayerFactory';
	import { Layer } from '@deck.gl/core';
	export let lc: LayerConfig[];
	export let tempLayers: Layer[] = [];
	export let isTemporalDisplacementVisible = false;

	const rangeValue = writable([0]);
	const {
		elements: { root, range, thumbs }
	} = createSlider({
		defaultValue: [0],
		min: 0,
		max: 100,
		step: 1,
		value: rangeValue
	});

	let interval: ReturnType<typeof setInterval> | null = null; // 初期値はnull
	let currentValue: number[] = [0];

	// 再生ボタンを押すと、レンジスライダーが動く
	const play = () => {
		// すでに再生中の場合は何もしない
		if (interval) return;

		interval = setInterval(() => {
			rangeValue.subscribe((value) => (currentValue = value))();
			if (!currentValue) return;
			const value = currentValue[0] + 1;
			if (value > 100) {
				tempLayers = makeTempLayers(lc, 0);
				rangeValue.set([0]);
			} else {
				tempLayers = makeTempLayers(lc, value);
				rangeValue.set([value]);
			}
		}, 500);
	};

	// 停止ボタンを押すと、レンジスライダーが止まる
	const stop = () => {
		if (interval) {
			clearInterval(interval);
			interval = null; // intervalをリセット
		}
	};
</script>

{#if isTemporalDisplacementVisible}
	<div class={cn('w-[280px] rounded-md bg-slate-300 p-2 pl-10 pr-10', $$props.class)}>
		<span use:melt={$root} class="relative flex h-[20px] w-[200px] items-center">
			<span class="mt-3 h-[3px] w-full bg-black/40">
				<span use:melt={$range} class="h-[3px] bg-white"></span>
			</span>

			<span
				use:melt={$thumbs[0]}
				class="mt-3 h-5 w-5 rounded-full bg-blue-500 focus:ring-4 focus:!ring-black/40"
			></span>
		</span>
		<!-- 再生ボタン -->
		<button class="mt-5 w-[90px] rounded-md bg-blue-500 p-2 text-white" onclick={play}>
			▶
		</button>
		<!-- 停止ボタン -->
		<button class="ml-2 mt-5 w-[90px] rounded-md bg-blue-500 p-2 text-white" onclick={stop}>
			STOP
		</button>
	</div>
{/if}
