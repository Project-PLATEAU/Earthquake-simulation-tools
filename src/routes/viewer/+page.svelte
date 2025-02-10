<script lang="ts">
	import { MapLibre, NavigationControl, VectorTileSource, FillLayer } from 'svelte-maplibre-gl';
	import { DeckGLOverlay } from 'svelte-maplibre-gl/deckgl';
	import type { PageData } from './$types';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import type { StyleSpecification } from 'maplibre-gl';
	import { MapboxOverlay } from '@deck.gl/mapbox';
	import { onMount } from 'svelte';
	import { getInitialStyle } from '$lib/viewer/utils/MapUtils';
	import { makeDeckLayers } from '$lib/viewer/utils/DeckLayerFactory';
	import { makeTempLayers } from '$lib/viewer/utils/tempLayerFactory';
	import LayerList from '$lib/viewer/components/SideNav/LayerList/LayerList.svelte';
	import Header from '$lib/viewer/components/Header/Header.svelte';
	import BackgroundSelector from '$lib/viewer/components/MapPanel/BackgroundSelector/BackgroundSelector.svelte';
	import TimeSlider from '$lib/viewer/components/MapPanel/TImeSlider/TimeSlider.svelte';
	import { initializeDeckContext } from '$lib/viewer/store/DeckStore';
	import { initializeMapContext } from '$lib/viewer/store/MapStore';
	import type { PickingInfo } from '@deck.gl/core';
	import { getPropertiesObj } from '$lib/viewer/utils/DeckUtils';
	// import SelectedTooltip from '$lib/viewer/components/MapPanel/tip/SelectedTooltip.svelte';
	import Chart from '$lib/viewer/compare/Chart.svelte';
	import {
		isVisible,
		toggleVisibility,
		leftData,
		rightData
	} from '$lib/viewer/store/CompareStore';
	import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw';
	import '@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css';
	import { getParam } from '$lib/viewer/utils/DeckLayerFactory';
	import { getIdByDataTitle } from '$lib/viewer/LayerFilter/menu';
	import type { LayerConfig } from '$lib/types/loadedData';
	import { Layer } from '@deck.gl/core';
	import { polygon, intersect, featureCollection } from '@turf/turf';
	import LoadingModal from '$lib/viewer/components/LoadingModal.svelte';

	import Legend from '$lib/viewer/components/MapPanel/Legend/Legend.svelte';

	import { PMTilesProtocol } from 'svelte-maplibre-gl/pmtiles';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	let map = $state(initializeMapContext());
	let mapStyle: StyleSpecification | undefined = $state(getInitialStyle(data.backgrounds));
	let renderingLayers: Layer[] = $state([]);
	let tempLayers: Layer[] = $state([]);
	let deckOverlay = $state(initializeDeckContext());
	let selectedLayerConfig: LayerConfig[] = $state([]);
	let selectedResourceTitles: string[] = $state(
		data.menu.flatMap((folder: { data: { checked: boolean; title: string }[] }) => {
			return folder.data
				.filter((resource) => {
					return resource.checked;
				})
				.map((resource) => {
					return resource.title;
				});
		})
	);
	let selectedLegendTitle = $state('');
	let tooltipData:
		| {
				tooltipType: 'default' | 'thumbnail' | 'table';
				id: string;
				data: any;
		  }
		| undefined = $state(undefined);
	let tooltipPosition:
		| {
				top: string;
				left: string;
		  }
		| undefined = $state(undefined);

	let emergencyRoadBuffer = $state(10);
	let isSchoolDistrictSelected = $state(false);
	let selectedDistrict: any = null;
	let isLoading = $state(false);
	let pmtilesLayerVisible = $state(false);
	let pmtilesConfigs = $state<
		Array<{
			url: string;
			sourceLayer: string;
			paint?: any;
		}>
	>([]);

	let selectedLegendLayerIds: string[] = $state([]);

	// 属性情報表示用の状態変数を追加
	let clickedFeatureInfo: { properties: any } | null = $state(null);

	const setTooltip = (info: PickingInfo<any>) => {
		const { coordinate, object } = info;
		if (!coordinate || !object) {
			clickedFeatureInfo = null;
			return;
		}

		// クリックされた位置を保存
		const x = info.x;
		const y = info.y;

		// クリックされた地物の属性情報を保存
		clickedFeatureInfo = {
			properties: object.properties || {}
		};

		const layerProps = info.layer?.props as {
			tooltipType?: 'default' | 'thumbnail' | 'table';
		};
		const tooltipType = layerProps?.tooltipType;
		const id = info.layer?.id;
		if (!tooltipType || !id) return;

		tooltipPosition = {
			top: `${y}px`,
			left: `${x}px`
		};
		const data = getPropertiesObj(object, tooltipType, id);
		tooltipData = {
			tooltipType,
			id,
			data
		};
	};

	const getFeaturesInBoundingBox = (
		layers: any[],
		layerId: string,
		boundingBox: { left: number; right: number; top: number; bottom: number }
	) => {
		const { left, right, top, bottom } = boundingBox;

		const features: any[] =
			$deckOverlay?.pickObjects({
				x: left,
				y: top,
				width: Math.abs(left - right),
				height: Math.abs(bottom - top),
				layerIds: [layerId]
			}) ?? [];

		return features;
	};

	const makeGraphData = (features: any[]) => {
		console.log('test:', features);
		$rightData = $leftData !== null ? { ...$leftData } : null;
		const damege_list = features.map((d) => getParam(d.object));
		$leftData = { data: damege_list, title: '' };
		console.log($leftData);
		console.log($rightData);
	};

	const makeGraphDataFromDistrict = (features: any[]) => {
		// rightDataのバックアップを作成（配列またはオブジェクトの場合に対応）
		$rightData = $leftData !== null ? { ...$leftData } : null;

		// 被害ランク別に集計
		const damageList = features.map((d) => getParam(d));

		// タイトル付きデータとして保存
		$leftData = {
			data: damageList,
			title: selectedDistrict.properties['NAME'] || '不明'
		};

		// グラフを表示
		$isVisible = true;
	};

	const onDistrictClick = async (info: PickingInfo<any>) => {
		isLoading = true;
		const { object } = info;
		if (!object) {
			isLoading = false;
			return;
		}
		selectedDistrict = object;
		try {
			await calculateDamageByDistrict();
		} finally {
			isLoading = false;
		}
	};

	const calculateDamageByDistrict = async () => {
		if (!selectedDistrict) {
			console.error('No district selected');
			return;
		}

		// 非同期処理を分割して実行
		const processFeatures = async () => {
			const features =
				$deckOverlay?.pickObjects({
					x: 0,
					y: 0,
					width: $map?.getCanvas().width || 0,
					height: $map?.getCanvas().height || 0,
					layerIds: ['building_damage']
				}) ?? [];

			// 重い処理を非同期化
			return new Promise<any[]>((resolve) => {
				setTimeout(() => {
					const buildingFeatures = features.map((f) => ({
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: Array.isArray(f.object.geometry.coordinates[0][0])
								? f.object.geometry.coordinates
								: [f.object.geometry.coordinates]
						},
						properties: f.object.properties
					}));
					resolve(buildingFeatures);
				}, 0);
			});
		};

		// 空間演算処理を非同期化
		const processSpatialIntersection = async (buildingFeatures: any[]) => {
			return new Promise<any[]>((resolve) => {
				setTimeout(() => {
					const turfDistrict = polygon(selectedDistrict.geometry.coordinates[0]);
					const damageInDistrict = buildingFeatures.filter((building) => {
						try {
							const turfBuilding = polygon(building.geometry.coordinates);
							const result = intersect(
								featureCollection([turfDistrict, turfBuilding])
							);
							return result !== null;
						} catch (e) {
							return false;
						}
					});
					resolve(damageInDistrict);
				}, 0);
			});
		};

		try {
			const buildingFeatures = await processFeatures();
			const damageInDistrict = await processSpatialIntersection(buildingFeatures);

			makeGraphDataFromDistrict(damageInDistrict);
			$isVisible = true;
		} catch (e) {
			console.error('Error processing district:', e);
		}
	};

	const dcklayer = makeDeckLayers(data.config.layers, setTooltip, onDistrictClick);
	const tmplayer = makeTempLayers(data.config.layers, 0);
	const deckLayers = [...dcklayer, ...tmplayer];

	let isTemporalDisplacementVisible = $state(false);
	const drawControl = new MaplibreTerradrawControl({
		modes: ['polygon', 'select', 'delete-selection', 'delete'],
		open: true
	});

	const separateLayers = (layers: LayerConfig[]) => {
		const pmtilesLayers = layers.filter((layer) => layer.type === 'pmtiles');
		const otherLayers = layers.filter((layer) => layer.type !== 'pmtiles');
		return { pmtilesLayers, otherLayers };
	};

	const closeLegend = () => {
		selectedLegendTitle = '';
		selectedLegendLayerIds = [];
	};

	onMount(async () => {
		await $map?.once('load');

		$deckOverlay = new MapboxOverlay({
			interleaved: true,
			layers: []
		});
		$map?.addControl($deckOverlay);
		$map?.addControl(drawControl, 'top-left');
		const drawInstance = drawControl.getTerraDrawInstance();

		if (drawInstance) {
			// You can add event listener to subscribe Terra Draw event as you wish.
			// The below example is to subscribe 'select' event of Terra Draw.

			drawInstance.on('finish', (id) => {
				const snapshot = drawInstance.getSnapshot();
				const features = snapshot?.find((feature) => feature.id === id);
				const coordinates = Array.isArray(features?.geometry.coordinates[0])
					? (features?.geometry.coordinates[0] as [number, number][]).map(
							(coordinate) => [
								$map?.project(coordinate).x,
								$map?.project(coordinate).y
							]
						)
					: [];
				// x列目とy列目を抽出
				const x = coordinates.map((row) => row[0]);
				const y = coordinates.map((row) => row[1]);

				// 四隅を計算
				const left = Math.min(...x.filter((value) => value !== undefined));
				const right = Math.max(...x.filter((value) => value !== undefined));
				const bottom = Math.min(...y.filter((value) => value !== undefined));
				const top = Math.max(...y.filter((value) => value !== undefined));
				const featureData = getFeaturesInBoundingBox(deckLayers, 'building_damage', {
					left: left,
					right: right,
					top: top,
					bottom: bottom
				});
				makeGraphData(featureData);
			});
		}
	});

	$effect(() => {
		// $effect の依存関係に selectedResourceTitles を追加するために snapshot を使う
		$state.snapshot(selectedResourceTitles);
		const selectedResourceids = selectedResourceTitles
			.map((title) => {
				const ids = getIdByDataTitle(data.menu, title);
				return ids ? ids[0] : undefined;
			})
			.filter((id) => id !== undefined);
		selectedLayerConfig = data.config.layers.filter((layer) => {
			return selectedResourceids.includes(layer.id);
		});
		const visibleLayerIds = data.menu.flatMap((folder) => {
			return folder.data
				.filter((resource) => selectedResourceTitles.includes(resource.title))
				.flatMap((resource) => resource.id);
		});
		const { pmtilesLayers, otherLayers } = separateLayers(data.config.layers);

		// 選択されているPMTilesレイヤーを全て取得
		const selectedPmtilesLayers = pmtilesLayers.filter((layer) =>
			selectedResourceids.includes(layer.id)
		);

		// PMTilesレイヤーの設定を更新
		if (selectedPmtilesLayers.length > 0) {
			pmtilesLayerVisible = true;
			pmtilesConfigs = selectedPmtilesLayers.map((layer) => ({
				url: layer.source,
				sourceLayer: layer.sourceLayer,
				paint: layer.paint // レイヤー固有のスタイル設定
			}));
		} else {
			pmtilesLayerVisible = false;
			pmtilesConfigs = [];
		}

		// PMTilesレイヤーの表示状態を更新
		pmtilesLayerVisible = selectedResourceids.some((id) =>
			pmtilesLayers.some((layer) => layer.id === id)
		);

		const layers_ = deckLayers
			.filter((layer) => {
				// pmtilesレイヤーをDeckGLから除外
				return !data.config.layers.some(
					(config) => config.id === layer.id && config.type === 'pmtiles'
				);
			})
			.map((layer) => {
				const config = otherLayers.find((c) => c.id === layer.id);
				return layer.clone({
					visible: visibleLayerIds.includes(layer.id),
					bufferMeter: config?.bufferMeter
				});
			});
		const tmpLayers = tempLayers.map((layer) => {
			return layer.clone({
				visible: visibleLayerIds.includes(layer.id)
			});
		});
		const tempIDs = tempLayers.map((layer) => {
			return layer.id;
		});
		const layers = layers_.filter((layer) => !tempIDs.includes(layer.id));

		isTemporalDisplacementVisible = data.config.layers.some(
			(l) => l.type === 'temporal_displacement' && visibleLayerIds.includes(l.id)
		);
		data.config.layers = data.config.layers.map((l) => {
			if (l.id === 'emergency_road') {
				return { ...l, bufferMeter: emergencyRoadBuffer };
			}
			return l;
		});
		renderingLayers = [...layers, ...tmpLayers];
		isSchoolDistrictSelected = selectedResourceTitles.some((title) =>
			title.includes('小学校区')
		);

		// selectedLegendLayerIdsの設定を修正
		if (selectedLegendTitle) {
			const legendLayerIds = data.menu.flatMap((folder) =>
				folder.data
					.filter((resource) => resource.title === selectedLegendTitle)
					.flatMap((resource) => resource.id)
			);

			// 現在表示されているレイヤーとマッチするものだけを選択
			selectedLegendLayerIds = legendLayerIds.filter(
				(id) =>
					selectedResourceids.includes(id) ||
					pmtilesConfigs.some((config) => config.sourceLayer === id)
			);
		} else {
			selectedLegendLayerIds = [];
		}
	});
</script>

<div class="relative flex h-auto max-h-screen min-h-screen w-full flex-col">
	<Header title={data.settings.title} className="h-12 bg-[#3b82f6]" />
	<div class="flex min-h-0 w-full flex-1 flex-row">
		<div class="mt-2 min-h-0 w-1/4 overflow-y-auto px-4">
			<LayerList
				bind:selectedResourceTitles
				menu={data.menu}
				layers={data.config.layers}
				bind:selectedLegendTitle
			/>
			{#if selectedLayerConfig.some((layer) => layer.type === 'mvt_emergency_road')}
				<div class="mt-10">
					<p class="text-xs">緊急輸送道路バッファ</p>
					<input type="number" bind:value={emergencyRoadBuffer} class="w-20 border p-1" />
					m
				</div>
			{/if}
			{#if isSchoolDistrictSelected}
				<p class="mt-2 text-sm text-gray-600">小学校区をクリックして被害を集計</p>
			{/if}
		</div>

		<div class="relative flex-1">
			<PMTilesProtocol />
			<MapLibre
				bind:map={$map}
				class="h-full w-full"
				style={mapStyle}
				zoom={data.initialView.map.zoom}
				center={data.initialView.map.center}
				bearing={data.initialView.map.bearing}
				pitch={data.initialView.map.pitch}
			>
				{#if pmtilesLayerVisible}
					{#each pmtilesConfigs as config}
						<VectorTileSource url={`pmtiles://${config.url}`}>
							<FillLayer
								sourceLayer={config.sourceLayer}
								paint={config.paint || {
									'fill-color': [
										'step',
										['get', 'JMA_BASE#'],
										'#ffffff',
										5,
										'#A2BFF2',
										5.5,
										'#A1D3A3',
										6,
										'#FFF9AA',
										6.5,
										'#E7B66E',
										7,
										'#DB7C7B'
									],
									'fill-opacity': 0.5
								}}
							/>
						</VectorTileSource>
					{/each}
				{/if}

				<NavigationControl />
				<DeckGLOverlay layers={renderingLayers} interleaved />
				<BackgroundSelector
					backgrounds={data.backgrounds}
					bind:style={mapStyle}
					className="absolute right-[48px] top-[10px] z-10"
				/>
				<TimeSlider
					bind:tempLayers
					lc={selectedLayerConfig}
					{isTemporalDisplacementVisible}
					class="absolute bottom-[10px] left-[48px] z-10"
				/>
				<!-- <SelectedTooltip {tooltipData} {tooltipPosition} /> -->
				<div class="absolute left-3 top-3 z-50">
					<Legend {selectedLegendTitle} {selectedLegendLayerIds} {closeLegend} />
				</div>
			</MapLibre>

			<!-- 属性情報の表示位置とスタイルを修正 -->
			{#if clickedFeatureInfo}
				<div class="fixed right-4 top-16 z-[100] w-64 rounded-lg bg-white p-4 shadow-lg">
					<h3 class="mb-2 font-bold">属性情報</h3>
					{#each Object.entries(clickedFeatureInfo.properties) as [key, value]}
						<div class="mb-1">
							<span class="font-semibold">{key}:</span>
							{value}
						</div>
					{/each}
					<button
						class="mt-2 rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
						onclick={() => (clickedFeatureInfo = null)}
					>
						閉じる
					</button>
				</div>
			{/if}
		</div>
	</div>

	{#if $isVisible}
		<Chart onClose={toggleVisibility} />
	{/if}
</div>

<LoadingModal bind:show={isLoading} />
