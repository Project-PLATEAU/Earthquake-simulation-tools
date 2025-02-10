<script lang="ts" module>
	export interface Props {
		isOpen: boolean;
		lng?: number;
		lat?: number;
		onClose?: () => void;
		onSelect?: (lng: number, lat: number) => void;
	}
</script>

<script lang="ts">
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
	import Button from '$lib/components/ui/Button.svelte';
	import type { MapMouseEvent } from 'maplibre-gl';

	const DEFAULT_LNG: number = 138.33323;
	const DEFAULT_LAT: number = 34.95373;

	let {
		isOpen = $bindable(),
		lng = DEFAULT_LNG,
		lat = DEFAULT_LAT,
		onClose,
		onSelect
	}: Props = $props();

	let lnglat = $state({
		lng: lng === undefined || Number.isNaN(lng) ? DEFAULT_LNG : lng,
		lat: lat === undefined || Number.isNaN(lat) ? DEFAULT_LAT : lat
	});
	let lngLatText = $derived(`(${lnglat.lat.toFixed(5)}, ${lnglat.lng.toFixed(5)})`);

	const handleMapClick = (e: MapMouseEvent) => {
		lnglat = {
			lng: e.lngLat.lng,
			lat: e.lngLat.lat
		};
	};
</script>

{#if isOpen}
	<!-- オーバーレイ -->
	<div class="fixed inset-0 z-50 bg-black bg-opacity-30">
		<div
			class="absolute inset-0 m-auto flex h-[90vh] w-[90vw] flex-col items-center gap-4 rounded-2xl bg-white p-10 shadow-lg"
		>
			<h2 class="w-full text-xl font-semibold text-gray-900">静岡市（全域）</h2>
			{#if !Number.isNaN(lnglat.lng) && !Number.isNaN(lnglat.lat)}
				<MapLibre
					class="h-[75vh] w-full"
					style={{
						version: 8,
						sources: {
							t_pale: {
								type: 'raster',
								tiles: [
									'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'
								],
								tileSize: 256,
								attribution:
									'<a href="http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html" target="_blank">地理院タイル</a>'
							}
						},
						layers: [
							{
								id: 't_pale',
								type: 'raster',
								source: 't_pale',
								minzoom: 0,
								maxzoom: 18
							}
						]
					}}
					zoom={16}
					center={{ lng: lnglat.lng, lat: lnglat.lat }}
					onclick={handleMapClick}
				>
					<Marker bind:lnglat>
						{#snippet content()}
							<div class="text-center leading-none">
								<div class="text-3xl">📍</div>
								<div class="font-bold text-black drop-shadow-sm">{lngLatText}</div>
							</div>
						{/snippet}
					</Marker>
				</MapLibre>
			{:else}
				<div class="flex h-[75vh] w-full items-center justify-center">
					<p>位置情報が設定されていません</p>
				</div>
			{/if}
			<div class="flex w-full justify-between">
				<Button
					onclick={() => {
						onClose?.();
						isOpen = false;
						onSelect?.(lnglat.lng, lnglat.lat);
					}}
				>
					決定
				</Button>
			</div>
		</div>
	</div>
{/if}
