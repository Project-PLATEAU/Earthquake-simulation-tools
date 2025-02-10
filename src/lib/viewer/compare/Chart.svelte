<script lang="ts">
	export interface Props {
		onClose?: () => void;
	}
	import { onMount } from 'svelte';
	import { leftData, rightData } from '$lib/viewer/store/CompareStore';
	import Chart from 'chart.js/auto';
	import { getColorParam } from '$lib/viewer/utils/DeckLayerFactory';

	let data1: DataType | null = null;
	let data2: DataType | null = null;
	let chart1: Chart<'pie' | 'bar', number[], string> | null = null;
	let chart2: Chart<'pie' | 'bar', number[], string> | null = null;
	let chartContainer1: HTMLCanvasElement;
	let chartContainer2: HTMLCanvasElement;

	let { onClose }: Props = $props();

	type DataType = Record<number, number>;

	const getUniqueCounts = (arr: number[]): DataType => {
		const counts = new Map<number | number, number>();

		// 配列の要素をループしてカウント
		arr.forEach((item) => {
			counts.set(item, (counts.get(item) || 0) + 1);
		});

		// Mapを配列の形式に変換
		const result: DataType = {};
		Array.from(counts.entries()).forEach(([value, count]) => (result[value] = count));
		return result;
	};

	const getColorAndName = (data: DataType) => {
		const names = Object.keys(data).map((key) => getColorParam(Number(key))?.name || '');
		const colors = Object.keys(data).map(
			(key) => getColorParam(Number(key))?.color || [0, 0, 0]
		);
		return { names: names, colors: colors };
	};

	let chartType = $state<'pie' | 'bar'>('bar'); // デフォルトを棒グラフに設定

	const updateCharts = () => {
		if (data1 && data2) {
			if (chart1) chart1.destroy();
			if (chart2) chart2.destroy();

			const context1 = chartContainer1.getContext('2d');
			if (context1) {
				const colorParam1 = getColorAndName(data1);
				chart1 = new Chart(context1, {
					type: chartType,
					data: {
						labels: colorParam1.names,
						datasets: [
							{
								data: Object.values(data1),
								backgroundColor: colorParam1.colors.map(
									(color) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`
								),
								borderColor: colorParam1.colors.map(
									(color) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`
								),
								borderWidth: 1
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								position: chartType === 'pie' ? 'top' : 'bottom',
								display: chartType === 'pie'
							}
						},
						scales: {
							y: {
								display: chartType === 'bar'
							}
						}
					}
				});
			}

			const context2 = chartContainer2.getContext('2d');
			if (context2) {
				const colorParam2 = getColorAndName(data2);
				chart2 = new Chart(context2, {
					type: chartType,
					data: {
						labels: colorParam2.names,
						datasets: [
							{
								data: Object.values(data2),
								backgroundColor: colorParam2.colors.map(
									(color) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`
								),
								borderColor: colorParam2.colors.map(
									(color) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`
								),
								borderWidth: 1
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								position: chartType === 'pie' ? 'top' : 'bottom',
								display: chartType === 'pie'
							}
						},
						scales: {
							y: {
								display: chartType === 'bar'
							}
						}
					}
				});
			}
		}
	};

	// 更新されたデータ形式に対応するための変換関数
	const convertToChartData = (data: { data: number[]; title: string } | null): DataType => {
		if (!data) return {};
		const result: DataType = {};
		data.data.map((item: number) => {
			result[item] = (result[item] || 0) + 1;
		});
		return result;
	};

	let currentTitle = $state('');
	let previousTitle = $state('');

	// onMountとupdateChartsを更新
	onMount(() => {
		data1 = convertToChartData($leftData);
		data2 = convertToChartData($rightData);
		updateCharts();
	});

	// データ更新時のハンドラを修正
	$effect(() => {
		if ($leftData) {
			// データとタイトルの更新を確実に行う
			currentTitle = $leftData.title;
			data1 = convertToChartData($leftData);

			if ($rightData) {
				previousTitle = $rightData.title;
				data2 = convertToChartData($rightData);
			}

			updateCharts();
		}
	});

	// クリア機能の追加
	const handleClear = () => {
		$leftData = null;
		$rightData = null;
		currentTitle = '';
		previousTitle = '';
		data1 = {};
		data2 = {};
		updateCharts();
		if (onClose) onClose();
	};

	const toggleChartType = () => {
		chartType = chartType === 'pie' ? 'bar' : 'pie';
		updateCharts();
	};
</script>

<svelte:head>
	<style>
		.chart-container {
			display: flex;
			flex-direction: row; /* 横並びにする */
			justify-content: space-around;
			flex-wrap: nowrap; /* 折り返さない */
		}
		.canvas-graph {
			display: block;
			max-width: 45%; /* 各グラフの最大幅をビューポートの45%に設定 */
			max-height: 300px; /* グラフの高さも適切に調整 */
		}
	</style>
</svelte:head>

<div class="z-50">
	<div class="w-full max-w-4xl items-center justify-center rounded bg-white p-4">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h1 class="text-lg font-bold">データ比較</h1>
				{#if currentTitle}
					<p class="mt-1 text-sm text-gray-600">左: {currentTitle}</p>
				{/if}
				{#if previousTitle}
					<p class="mt-1 text-sm text-gray-500">右: {previousTitle}</p>
				{/if}
			</div>
			<div class="flex gap-2">
				<button
					class="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
					onclick={toggleChartType}
				>
					{chartType === 'pie' ? '棒グラフ' : '円グラフ'}に切替
				</button>
				<button
					class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
					onclick={handleClear}
				>
					クリア
				</button>
			</div>
		</div>
		<div class="chart-container">
			<canvas class="canvas-graph" bind:this={chartContainer1}></canvas>
			<canvas class="canvas-graph" bind:this={chartContainer2}></canvas>
		</div>
		<button class="mt-4 rounded bg-red-500 p-2 text-white" onclick={onClose}>閉じる</button>
	</div>
</div>
