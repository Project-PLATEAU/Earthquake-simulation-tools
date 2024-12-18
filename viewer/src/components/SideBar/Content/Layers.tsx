import React, { FC, useCallback, useContext, useEffect } from 'react';
import { context } from '@/pages/_app';
import { Data } from '@/components/LayerFilter/menu';
import { getResourceIcon } from '@/components/SideBar/Icon';
import { DownloadIcon, smallShareIcon } from '@/components/SideBar/Icon';
import { useRecoilState } from 'recoil';
import { LayersState, TemporalLayerConfigState } from '@/store/LayersState';
import { makeDeckGLLayer } from '@/components/Map/Layer/deckGlLayerFactory';
import { TEMPORAL_LAYER_TYPES } from '@/components/Map/Layer/temporalLayerMaker';
import { getLayerConfigById } from '@/components/LayerFilter/config';
import { TooltipDataState, TooltipPositionState } from '@/store/TooltipState';

const isSelected = (resourceName: string, selectedResourceNameList: string[]): boolean => {
  return selectedResourceNameList.includes(resourceName);
};

const setResourceViewState = (resource: Data, setClickedLayerViewState: any) => {
  setClickedLayerViewState({
    longitude: resource.lng,
    latitude: resource.lat,
    zoom: resource.zoom,
    id: resource.id[0],
  });
};

type LayersProps = {
  onChange?: (layerId: string, checked: boolean) => void;
  layers: Data[];
};

export const Layers: FC<LayersProps> = ({ layers, onChange }) => {
  const {
    checkedLayerTitleList,
    setCheckedLayerTitleList,
    setClickedLayerViewState,
    setMouseTooltipData,
    preferences,
  } = useContext(context);
  const [_deckGLLayers, setDeckGLLayers] = useRecoilState(LayersState);
  const [_temporalLayerConfigs, setTemporalLayerConfigs] = useRecoilState(TemporalLayerConfigState);
  const [_tooltipData, setTooltipData] = useRecoilState(TooltipDataState);
  const [_tooltipPosition, setTooltipPosition] = useRecoilState(TooltipPositionState);

  const layerCreateById = useCallback(
    (ids: string[]) => {
      return ids.forEach((id) => {
        // @ts-ignore
        const layerConfig = getLayerConfigById(id, preferences.config);
        if (!layerConfig) {
          return;
        }
        if (TEMPORAL_LAYER_TYPES.includes(layerConfig.type)) {
          setTemporalLayerConfigs((currVal) => {
            return [...currVal, layerConfig];
          });
        } else {
          const deckGLlayer = makeDeckGLLayer(layerConfig, setTooltipData, setTooltipPosition);
          if (deckGLlayer) {
            setDeckGLLayers((currVal) => {
              return [...currVal, deckGLlayer];
            });
          }
        }
      });
    },
    [
      // @ts-ignore
      preferences.config,
      setTemporalLayerConfigs,
      setTooltipData,
      setTooltipPosition,
      setDeckGLLayers,
    ]
  );

  //最初の一度だけ、menuのcheckedを確認し、trueならレイヤーを作成する
  useEffect(() => {
    layers
      .filter((value) => value.checked)
      .forEach((value) => {
        layerCreateById(value.id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences]);

  const toggleSelectedResourceList = (resource: Data) => {
    // 既存のリストに対象リソースが入っていなければ格納
    if (!isSelected(resource.title, checkedLayerTitleList)) {
      setCheckedLayerTitleList((prevList) => [...prevList, resource.title]);
      // クリックされたリソースの位置情報を保存する
      setResourceViewState(resource, setClickedLayerViewState);

      layerCreateById(resource.id);

      return;
    }

    //リストから削除
    const newList = checkedLayerTitleList.filter((item) => {
      return item !== resource.title;
    });
    resource.id.forEach((id) => {
      // @ts-ignore
      const layerConfig = getLayerConfigById(id, preferences.config);
      if (!layerConfig) {
        return;
      }
      if (TEMPORAL_LAYER_TYPES.includes(layerConfig.type)) {
        setTemporalLayerConfigs((currVal) => {
          return currVal.filter((value) => {
            return layerConfig.id !== value.id;
          });
        });
      } else {
        setDeckGLLayers((currVal) => {
          return currVal.filter((value) => {
            return id !== value.id;
          });
        });
      }
    });
    setCheckedLayerTitleList([...newList]);
    //チェックが外れた時はnullをセットしてflyToしない
    setClickedLayerViewState(null);
  };

  const resourceStyle = {
    fontSize: '0.75rem',
  };

  const textStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  } as React.CSSProperties;

  return (
    <>
      {layers.map((resource, index) => (
        <label key={resource.title}>
          <div
            className="transition-hover duration-500 ease bg-white hover:bg-gray-200 p-2 flex"
            style={resourceStyle}
            key={index}
          >
            <div className="w-11/12 pr-3 flex items-center">
              <input
                type="checkbox"
                className="rounded-full mx-1 text-cyan-600 focus:outline-none min-w-16 min-h-16 max-w-16 max-h-16"
                checked={isSelected(resource.title, checkedLayerTitleList)}
                onChange={(e) => {
                  toggleSelectedResourceList(resource);
                  onChange && onChange(resource.id[0], e.target.checked);
                }}
              />
              {
                // @ts-ignore
                getResourceIcon(resource, preferences.config)
              }
              <p
                onMouseOver={(event) =>
                  setMouseTooltipData(() => ({
                    text: resource.title,
                    top: (window.innerHeight - event.clientY + 10) * -1,
                    left: 20,
                  }))
                }
                onMouseOut={() => setMouseTooltipData(() => null)}
                style={textStyle}
              >
                {resource.title}
              </p>
            </div>
            <div className="w-1/12">
              {resource.download_url === undefined
                ? undefined
                : DownloadIcon(resource.download_url)}
            </div>
            {/* <div
              className="w-1/12"
              onMouseOver={(event) =>
                setMouseTooltipData(() => ({
                  text: 'リンクをコピー',
                  top: (window.innerHeight - event.clientY) * -1,
                  left: event.clientX,
                }))
              }
              onMouseOut={() => setMouseTooltipData(() => null)}
            >
              {smallShareIcon(resource.id[0])}
            </div> */}
          </div>
        </label>
      ))}
    </>
  );
};
