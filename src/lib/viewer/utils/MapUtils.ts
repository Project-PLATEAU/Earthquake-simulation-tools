import type { Backgrounds } from '$lib/types/loadedData';
import type { StyleSpecification } from 'maplibre-gl';

/**
 * MapLibre GL JSの初期スタイルを取得する
 * 初期スタイル=./src/assets/backgrounds.jsonで定義された背景が表示されている状態
 */
export const getInitialStyle = (backgrounds: Backgrounds): StyleSpecification => {
	const defaultBackgroundData = backgrounds[Object.keys(backgrounds)[0]];
	const style: StyleSpecification = {
		version: 8,
		sources: {
			background: defaultBackgroundData.source
		},
		layers: [
			{
				id: 'background',
				type: 'raster',
				source: 'background',
				minzoom: 0,
				maxzoom: 22
			}
		]
	};
	return style;
};

export const getBackgroundStyle = (
	backgrounds: Backgrounds,
	backgroundId: string
): StyleSpecification => {
	const backgroundData = backgrounds[backgroundId];
	const style: StyleSpecification = {
		version: 8,
		sources: {
			background: backgroundData.source
		},
		layers: [
			{
				id: 'background',
				type: 'raster',
				source: 'background',
				minzoom: 0,
				maxzoom: 22
			}
		]
	};
	return style;
};
