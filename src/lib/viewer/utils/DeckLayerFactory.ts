import type { LayerConfig } from '$lib/types/loadedData';
import { ArcLayer, BitmapLayer, GeoJsonLayer, IconLayer } from '@deck.gl/layers';
import type { Feature } from 'geojson';
import { buffer } from '@turf/buffer';
import { lineString, multiLineString } from '@turf/helpers';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { type GeoBoundingBox, MVTLayer, Tile3DLayer, TileLayer } from '@deck.gl/geo-layers';
import { Tiles3DLoader } from '@loaders.gl/3d-tiles';
import { Vector3 } from 'math.gl';
import { Layer, type PickingInfo } from '@deck.gl/core';
import { MaskExtension } from '@deck.gl/extensions';

// カスタムrenderSubLayers関数 x
const renderSubLayers = (props: any) => {
	const tiles: Feature[] | null = props.tile.dataInWGS84;
	if (!tiles) {
		return null;
	}
	const features = tiles.map((feature) => {
		const buffered =
			feature.geometry.type === 'LineString'
				? buffer(lineString(feature.geometry.coordinates), props.bufferMeter || 50, {
						units: 'meters'
					})
				: feature.geometry.type === 'MultiLineString'
					? buffer(
							multiLineString(feature.geometry.coordinates),
							props.bufferMeter || 50,
							{
								units: 'meters'
							}
						)
					: null;
		const feature_: Feature = {
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: buffered ? buffered.geometry.coordinates : []
			},
			properties: feature.properties
		};
		return feature_;
	});

	return new GeoJsonLayer({
		id: `geojson-layer-${props.id}`,
		data: {
			type: 'FeatureCollection',
			features
		},
		getFillColor: (d) => {
			// プロパティから道路タイプを取得
			const roadType = d.properties?.N10_002;
			// 道路タイプに応じた色を定義
			switch (roadType) {
				case 1:
					return [255, 75, 0]; // 赤
				case 2:
					return [3, 175, 122]; // 緑
				case 3:
					return [0, 90, 255]; // 青
				default:
					return [200, 200, 200]; // グレー（デフォルト）
			}
		}
	});
};

const displacementDamageColor = (param?: number) => {
	return [
		{
			param: param ? param === 1 : false,
			name: '木造：軽微',
			color: [64, 96, 191, 200]
		},
		{
			param: param ? param === 2 : false,
			name: '木造：被害',
			color: [255, 255, 0, 200]
		},
		{
			param: param ? param === 3 : false,
			name: '木造：倒壊',
			color: [255, 128, 128, 200]
		},
		{
			param: param ? param === 4 : false,
			name: 'RC造・S造：軽微',
			color: [64, 191, 96, 200]
		},
		{
			param: param ? param === 5 : false,
			name: 'RC造・S造：小破',
			color: [110, 159, 231, 200]
		},
		{
			param: param ? param === 6 : false,
			name: 'RC造・S造：中破',
			color: [231, 182, 110, 200]
		},
		{
			param: param ? param === 7 : false,
			name: 'RC造・S造：大破',
			color: [255, 0, 0, 200]
		}
	];
};

const calculateElevation = (d: any) => {
	if ('height' in d.properties) {
		return d.properties.height;
	}
	if ('bui_floor' in d.properties) {
		return (d.properties.bui_floor || 2) * 3;
	}
	return 2 * 3; // デフォルト値
};

export const getColorParam = (param: number | undefined) => {
	const colorParamList = displacementDamageColor(param);
	const colorParam = colorParamList.find((colorParam) => colorParam.param);
	return colorParam;
};

export const getParam = (d: any) => {
	let param: number = 1;
	const drift = d.properties['max_drift'];
	// 木造
	if (
		d.properties['_NAME00000'] === 'WoodMDOF' ||
		d.properties['_NAME00001'] === 'wood' ||
		d.properties['_NAME00001'] === 'WoodMDOF' ||
		d.properties['_NAME00002'] === 'wood'
	) {
		if (drift < 0.017) {
			param = 1;
		}
		if (0.017 <= drift && drift < 0.1) {
			param = 2;
		}
		if (0.1 <= drift) {
			param = 3;
		}
	}
	// RC造
	if (
		d.properties['_NAME00001'] === 'RC' ||
		d.properties['_NAME00001'] === 'SRC' ||
		d.properties['_NAME00002'] === 'RC' ||
		d.properties['_NAME00002'] === 'SRC'
	) {
		if (drift < 0.004) {
			param = 4;
		}
		if (0.004 <= drift && drift < 0.01) {
			param = 5;
		}
		if (0.01 <= drift && drift < 0.02) {
			param = 6;
		}
		if (0.02 <= drift) {
			param = 7;
		}
	}
	// S造
	if (d.properties['_NAME00000'] === 'SteelMDOF' || d.properties['_NAME00001'] === 'SteelMDOF') {
		if (drift < 0.005) {
			param = 4;
		}
		if (0.005 <= drift && drift < 0.01) {
			param = 5;
		}
		if (0.01 <= drift && drift < 0.025) {
			param = 6;
		}
		if (0.025 <= drift) {
			param = 7;
		}
	}
	return param;
};

export const makeDeckLayers = (
	layerConfigs: LayerConfig[],
	showTooltip: (info: PickingInfo) => void,
	onDistrictClick?: (info: PickingInfo) => void
): Layer[] => {
	const deckLayers = [];
	for (const layerConfig of layerConfigs) {
		switch (layerConfig.type) {
			case 'geojson': {
				const { type, source, visible, ...otherConfig } = layerConfig;
				deckLayers.push(
					new GeoJsonLayer({
						data: source,
						visible: true,
						pickable: true,
						autoHighlight: true,
						onClick:
							layerConfig.id === 'shizuoka-branch' ? onDistrictClick : showTooltip,
						getFillColor: (d: {
							properties?: { fillColor?: [number, number, number, number] };
						}) => d.properties?.fillColor || [0, 0, 0, 255],
						lineWidthUnits: 'pixels',
						...otherConfig
					})
				);
				break;
			}
			case 'geojsonicon': {
				const { type, source, visible, ...otherConfig } = layerConfig;

				deckLayers.push(
					new GeoJsonLayer({
						data: source,
						visible: true,
						pickable: true,
						autoHighlight: true,
						onClick: showTooltip,
						pointType: 'icon',
						getIcon: () => ({
							url: layerConfig.icon.url,
							width: layerConfig.icon.width,
							height: layerConfig.icon.height,
							anchorY: layerConfig.icon.anchorY,
							mask: false
						}),
						parameters: {
							depthTest: false
						},
						...otherConfig
					})
				);
				break;
			}
			case 'Arc': {
				const { id, type, source, data, visible, ...otherConfig } = layerConfig;
				deckLayers.push(
					new ArcLayer({
						id: id,
						visible: true,
						pickable: true,
						data: data ? data : source,
						getWidth: layerConfig.width,
						getSourcePosition: (d) => d.from.coordinates,
						getTargetPosition: (d) => d.to.coordinates,
						getSourceColor: layerConfig.sourceColor,
						getTargetColor: layerConfig.targetColor,
						...otherConfig
					})
				);
				break;
			}
			case 'icon': {
				const { id, type, source, visible, ...otherConfig } = layerConfig;
				deckLayers.push(
					new IconLayer({
						id: id,
						data: [layerConfig],
						visible: true,
						pickable: true,
						getIcon: (_) => ({
							url: source,
							width: 100,
							height: 150,
							anchorY: 128,
							mask: false
						}),
						sizeScale: 8,
						getSize: 5,
						// onClick: showTooltip,
						...otherConfig
					})
				);
				break;
			}
			case 'mvt': {
				const { type, source, visible, ...otherConfig } = layerConfig;
				deckLayers.push(
					new MVTLayer({
						data: layerConfig.source,
						visible: true,
						pickable: true,
						autoHighlight: true,
						// onClick: showTooltip,
						loadOptions: {
							mvt: {
								shape: 'geojson'
							}
						},
						...otherConfig,
						getFillColor: (d) => {
							return getColorParam(getParam(d))?.color as [
								number,
								number,
								number,
								number
							];
						},
						extruded: true,
						getElevation: (d) => {
							return calculateElevation(d);
						},
						extensions: [new MaskExtension()]
					})
				);
				break;
			}
			case '3dtiles': {
				const { type, source, visible, ...otherConfig } = layerConfig;
				deckLayers.push(
					new Tile3DLayer({
						data: layerConfig.source,
						visible: true,
						pickable: true,
						autoHighlight: true,
						onClick: showTooltip,
						_subLayerProps: {
							scenegraph: { _lighting: 'pbr' }
						},
						...otherConfig,
						loaders: [Tiles3DLoader],
						onTileLoad: (tileHeader) => {
							tileHeader.content.cartographicOrigin = new Vector3(
								tileHeader.content.cartographicOrigin.x,
								tileHeader.content.cartographicOrigin.y,
								tileHeader.content.cartographicOrigin.z - 72.5
							);
						},
						opacity: 1.0
					})
				);
				break;
			}
			case 'raster': {
				const { type, source, visible, ...otherConfig } = layerConfig;
				deckLayers.push(
					new TileLayer({
						data: layerConfig.source,
						visible: true,
						tileSize: 256,

						renderSubLayers: (props) => {
							const { west, south, east, north } = props.tile.bbox as GeoBoundingBox;

							return new BitmapLayer(props, {
								image: props.data,
								bounds: [west, south, east, north]
							});
						},

						...otherConfig
					})
				);
				break;
			}
			case 'mvt_emergency_road': {
				const { type, source, visible, ...otherConfig } = layerConfig;
				deckLayers.push(
					new MVTLayer({
						data: layerConfig.source,
						visible: true,
						pickable: true,
						autoHighlight: true,
						bufferMeter: layerConfig.bufferMeter, // bufferMeterを追加
						// onClick: showTooltip,
						...otherConfig,
						getLineColor: (d) => {
							// プロパティから道路タイプを取得
							const roadType = d.properties?.N10_002;
							// 道路タイプに応じた色を定義
							switch (roadType) {
								case 1:
									return [255, 75, 0, 255]; // 赤
								case 2:
									return [3, 175, 122, 255]; // 緑
								case 3:
									return [0, 90, 255, 255]; // 青
								default:
									return [200, 200, 200, 255]; // グレー（デフォルト）
							}
						},
						renderSubLayers: renderSubLayers,
						loadOptions: {
							mvt: {
								shape: 'geojson'
							}
						},
						extruded: true
					})
				);
				break;
			}
			case 'gltf': {
				const { type, source, visible, ...otherConfig } = layerConfig;

				deckLayers.push(
					new ScenegraphLayer({
						data: [null],
						visible: true,
						scenegraph: source,
						getPosition: () => layerConfig.coords,
						getOrientation: () => layerConfig.orientation,
						pickable: true,
						onClick: showTooltip,
						updateTriggers: {
							getColor: [128, 0, 0]
						},
						_animations: {
							'*': { speed: 1 }
						},
						_lighting: 'pbr',
						sizeScale: 1,
						...otherConfig
					})
				);
				break;
			}
		}
	}
	return deckLayers;
};
