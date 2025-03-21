import type { Color } from '@deck.gl/core';
import type { RasterSourceSpecification } from 'maplibre-gl';

/**
 * settings.json
 */
export type Settings = {
	title: string;
	background_color: string;
	tooltip_background_color: string;
};
/**
 * backgrounds.json
 */
export type Backgrounds = {
	[key: string]: {
		name: string;
		source: RasterSourceSpecification;
	};
};
/**
 * initial_view.json
 */
export type InitialView = {
	map: {
		center: [number, number];
		zoom: number;
		bearing: number;
		pitch: number;
	};
};

export type Disaster = {
	text: string;
	value: string;
};

/**
 * disasters.json
 */
export type Disasters = {
	default: number;
	data: Disaster[];
};

/**
 * 複数の設定ファイルJSONを読み込んだ結果を格納するデータ型
 */
export type Preferences = {
	settings: Settings;
	menu: Menu;
	config: Config;
	backgrounds: Backgrounds;
	initialView: InitialView;
};

type DataType =
	| 'raster'
	| 'vector'
	| 'polygon'
	| 'line'
	| 'point'
	| 'building'
	| 'icon'
	| 'transaction'
	| 'pointcloud'
	| 'personflow';

/**
 * menu.json直下のFolderがもつレイヤー定義
 * menu.json内ではdata:Data[]として配列で保持されている
 */
export type Data = {
	title: string;
	type: DataType;
	lng: number;
	lat: number;
	zoom: number;
	id: string[];
	checked: boolean;
	color?: string;
	icon?: string;
	download_url?: string;
};

/**
 * menu.json直下の各要素
 * Folderはメタデータのほかdata: Data[]として子要素の配列を持つ
 */
export type Folder = {
	category: string;
	url?: string;
	open?: boolean;
	data: Data[];
};

/**
 * menu.jsonの構造と一致する型
 */
export type Menu = Folder[];

type LayerConfigType =
	| 'raster'
	| 'mvt'
	| 'geojson'
	| 'geojsonicon'
	| 'icon'
	| 'bus_trip'
	| '3dtiles'
	| 'Scatterplot'
	| 'Arc'
	| 'temporal_polygon'
	| 'temporal_polygon_shape'
	| 'temporal_polygon_area'
	| 'temporal_line'
	| 'gltf'
	| 'trips_json'
	| 'trips_drm'
	| 'text'
	| 'temporal_displacement'
	| 'mvt_emergency_road'
	| 'pmtiles';

type LayerConfigGenericProps = {
	id: string;
	source: string;
	type: LayerConfigType;
	minzoom?: number;
	maxzoom?: number;
	opacity?: number;
	visible?: boolean;
	icon?: {
		url: string;
		width: number;
		height: number;
		anchorY: number;
	};
};

type RasterLayerConfig = LayerConfigGenericProps & {
	type: 'raster';
};

type MvtLayerConfig = LayerConfigGenericProps & {
	type: 'mvt';
	getFillColor: Color;
	getLineColor?: Color;
};

export type GeojsonLayerConfig = LayerConfigGenericProps & {
	type: 'geojson';
	getLineColor?: Color;
	lineWidthMinPixels: number;
	getFillColor?: Color;
	sizeScale?: number;
	iconSizeScale?: number;
	pointType?: string;
};

export type GeojsonIconLayerConfig = LayerConfigGenericProps & {
	type: 'geojsonicon';
	stroked: boolean;
	filled: boolean;
	icon: {
		url: string;
		width: number;
		height: number;
		anchorY: number;
	};
	iconSizeScale: number;
};

type IconLayerConfig = LayerConfigGenericProps & {
	type: 'icon';
	coords: [number, number, number];
	color: Color;
};

type BustripLayerConfig = LayerConfigGenericProps & {
	type: 'bus_trip';
	iconUrl: string;
};

type Tile3dLayerConfig = LayerConfigGenericProps & {
	type: '3dtiles';
	pointsize: number;
};

type ScatterprotLayerConfig = LayerConfigGenericProps & {
	type: 'Scatterplot';
	id: string;
	data: string;
	getLineColor: Color;
	getFillColor: Color;
	minzoom: number;
	maxzoom: number;
	visible: boolean;
};

type ArcLayerConfig = LayerConfigGenericProps & {
	type: 'Arc';
	id: string;
	data: string;
	width: number;
	sourceColor: Color;
	targetColor: Color;
	minzoom: number;
	maxzoom: number;
	visible: boolean;
};

type TemporalPolygonLayerConfig = LayerConfigGenericProps & {
	type: 'temporal_polygon';
	values: [number, number];
	colors: [Color, Color];
	heights?: [number, number];
	colorScale: number;
};

type TemporalPolygonShapeLayerConfig = LayerConfigGenericProps & {
	type: 'temporal_polygon_shape';
	values: [number, number];
	colors: [Color, Color];
	heights?: [number, number];
	colorScale: number;
};

type TemporalPolygonAreaLayerConfig = LayerConfigGenericProps & {
	type: 'temporal_polygon_area';
	values: [number, number];
	colors: [Color, Color];
	heights?: [number, number];
	colorScale: number;
};

type TemporalLineLayerConfig = LayerConfigGenericProps & {
	type: 'temporal_line';
	values: [number, number];
	colors: [Color, Color];
	widths: [number, number];
};

type GltfLayerConfig = LayerConfigGenericProps & {
	type: 'gltf';
	coords: [number, number, number];
	color: Color;
	orientation: [number, number, number];
};

type TripsJsonLayerConfig = LayerConfigGenericProps & {
	type: 'trips_json';
	color: Color;
	trailLength: number;
};

type TripsDrmLayerConfig = LayerConfigGenericProps & {
	type: 'trips_drm';
	values: [number, number];
	colors: [Color, Color];
	step: number;
};

type TextLayerConfig = LayerConfigGenericProps & {
	type: 'text';
	getSize: number;
	getAngle: number;
	label: string;
};

type TemporalDisplacement = LayerConfigGenericProps & {
	type: 'temporal_displacement';
	values: [number, number];
	colors: [Color, Color];
};

type EmergencyLayerConfig = LayerConfigGenericProps & {
	type: 'mvt_emergency_road';
	getLineColor?: Color;
	buffer: number;
	bufferMeter?: number;
};

type PmtilesLayerConfig = LayerConfigGenericProps & {
	type: 'pmtiles';
};

export type LayerConfig =
	| RasterLayerConfig
	| MvtLayerConfig
	| GeojsonLayerConfig
	| GeojsonIconLayerConfig
	| IconLayerConfig
	| BustripLayerConfig
	| Tile3dLayerConfig
	| ScatterprotLayerConfig
	| ArcLayerConfig
	| TemporalPolygonLayerConfig
	| TemporalPolygonShapeLayerConfig
	| TemporalPolygonAreaLayerConfig
	| TemporalLineLayerConfig
	| GltfLayerConfig
	| TripsJsonLayerConfig
	| TripsDrmLayerConfig
	| TextLayerConfig
	| TemporalDisplacement
	| EmergencyLayerConfig
	| PmtilesLayerConfig;

export type Config = {
	layers: LayerConfig[];
};
