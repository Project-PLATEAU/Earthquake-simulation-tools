import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { GLTFLoader } from '@loaders.gl/gltf';
import { fetchFile, parse } from '@loaders.gl/core';
import { showToolTip } from '../../Tooltip/show';

/**
 * GLTF Layerの作成
 * @param layerConfig {any}
 * @param setTooltipData {Dispatch<SetStateAction<any>>}
 * @param setTooltipPosition ポップアップのスタイルをセットする関数
 * @returns {ScenegraphLayer}
 */
export function makeGltfLayer(layerConfig, setTooltipData, setTooltipPosition) {
  const gltfCreator = new gltfLayerCreator(layerConfig, setTooltipData, setTooltipPosition);
  return gltfCreator.makeDeckGlLayer();
}

class gltfLayerCreator {
  layerConfig;
  layerType = 'gltf';
  setTooltipData;
  setTooltipPosition;

  /**
   *
   * @param layerConfig {any}
   * @param map {maplibregl.Map}
   * @param setTooltipData {Dispatch<SetStateAction<any>>}
   */
  constructor(layerConfig, setTooltipData, setTooltipPosition) {
    this.layerConfig = layerConfig;
    this.setTooltipData = setTooltipData;
    this.setTooltipPosition = setTooltipPosition;
  }

  /**
   * DeckGLLayerの作成
   * @returns {ScenegraphLayer}
   */
  makeDeckGlLayer() {
    const { layerConfig } = this;

    let addParam = {};
    if (layerConfig.color) {
      addParam = {
        _lighting: 'pbr',
        getColor: layerConfig.color,
      };
    }

    if (this.isTargetConfig(layerConfig)) {
      return new ScenegraphLayer({
        id: layerConfig.id,
        data: [null],
        visible: true,
        scenegraph: layerConfig.source,
        getPosition: () => layerConfig.coords,
        getOrientation: () => layerConfig.orientation,
        pickable: true,
        onClick: this.showToolTip,
        updateTriggers: {
          getColor: [128, 0, 0],
        },
        ...addParam,
      });
    }
    return null;
  }

  extractLayerConfig = (layerConfig) => {
    const { type, source, visible, ...otherConfig } = layerConfig;
    return otherConfig;
  };

  isTargetConfig(layer) {
    return layer.type === this.layerType;
  }

  showToolTip = (info) => {
    showToolTip(info, this.setTooltipData, this.setTooltipPosition);
  };
}
