import type { LayerConfig } from '$lib/types/loadedData';
import { MVTLayer } from '@deck.gl/geo-layers';
import { Layer } from '@deck.gl/core';
/*
 TODO: 一部のLayerConfigTypeに対応するDeckLayerが現在未実装
*/

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
			color: [255, 0, 0, 200]
		},
		{
			param: param ? param === 4 : false,
			name: 'RC造・S造：軽微',
			color: [64, 96, 191, 200]
		},
		{
			param: param ? param === 5 : false,
			name: 'RC造・S造：小破',
			color: [255, 255, 0, 200]
		},
		{
			param: param ? param === 6 : false,
			name: 'RC造・S造：中破',
			color: [255, 191, 0, 200]
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

export const makeTempLayers = (layerConfigs: LayerConfig[], timestamp: number): Layer[] => {
	const deckLayers = [];
	for (const layerConfig of layerConfigs) {
		switch (layerConfig.type) {
			case 'temporal_displacement': {
				const { type, source, visible, ...otherConfig } = layerConfig;
				deckLayers.push(
					new MVTLayer({
						data: source,
						visible: true,
						extruded: true,
						getFillColor: (d) => {
							if (d.properties['displacement_mean']) {
								// displacement_meanが配列出ない場合は抜ける
								let dataArray;
								try {
									dataArray = JSON.parse(d.properties['displacement_mean']);
								} catch (e) {
									dataArray = JSON.parse(
										'[' + d.properties['displacement_mean'] + ']'
									);
								}
								if (dataArray.length === 0) {
									return [0, 0, 0, 0];
								}
								const target = timestamp;
								const val = Number(dataArray[target]) || 0;
								return displacementValueColor(val * 10000);
							}
							return [0, 0, 0, 0];
						},
						getElevation: (d) => {
							if ('bui_floor' in d.properties) {
								if (d.properties.bui_floor === 0) {
									return 2 * 3;
								} else {
									return d.properties.bui_floor * 3;
								}
							}
							return 2 * 3;
						},
						stroked: false,
						filled: true,
						updateTriggers: {
							getFillColor: [timestamp]
						},

						...otherConfig
					})
				);
				break;
			}
		}
	}
	return deckLayers;
};

const displacementValueColor = (val: number): number[] | undefined => {
	const alpha = 200;
	if (val < 0) {
		return [200, 0, 0, alpha];
	}
	if (val >= 0 && val < 50) {
		return [80, 64, 191, alpha];
	}
	if (val >= 50 && val < 100) {
		return [64, 96, 191, alpha];
	}
	if (val >= 100 && val < 150) {
		return [64, 143, 191, alpha];
	}
	if (val >= 150 && val < 200) {
		return [64, 191, 191, alpha];
	}
	if (val >= 200 && val < 250) {
		return [64, 191, 164, alpha];
	}
	if (val >= 250 && val < 300) {
		return [64, 191, 127, alpha];
	}
	if (val >= 300 && val < 350) {
		return [96, 191, 64, alpha];
	}
	if (val >= 350 && val < 400) {
		return [64, 191, 64, alpha];
	}
	if (val >= 400 && val < 450) {
		return [127, 191, 64, alpha];
	}
	if (val >= 450 && val < 500) {
		return [191, 191, 64, alpha];
	}
	if (val >= 500 && val < 550) {
		return [191, 164, 64, alpha];
	}
	if (val >= 550 && val < 600) {
		return [191, 127, 64, alpha];
	}
	if (val >= 600 && val < 650) {
		return [191, 111, 64, alpha];
	}
	if (val >= 650 && val < 700) {
		return [191, 96, 64, alpha];
	}
	if (val >= 700 && val < 750) {
		return [191, 64, 64, alpha];
	}
	if (val >= 750) {
		return [191, 64, 111, alpha];
	}
};
