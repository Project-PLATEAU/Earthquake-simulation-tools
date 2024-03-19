import React, { useContext, useEffect, useRef, useState } from 'react';

import { Map, NavigationControl, Style } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Deck, FlyToInterpolator } from '@deck.gl/core/typed';

import { context } from '@/pages/_app';
import { useFlyTo, easeOutQuart } from '@/components/Map/Animation/flyTo';
import Legend, { useGetClickedLayerId } from '@/components/Map/Legend';
import Info, { useGetInfoClickedLayerId } from '@/components/Map/Info';

import BackgroundSelector from './Controller/BackgroundSelector';
import { TimeSlider } from '@/components/Map/Controller/TimeSlider';
import { getLayerConfigById } from '@/components/LayerFilter/config';
import { Backgrounds, Preferences } from '@/components/LayerFilter/loader';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  LayersState,
  TemporalLayerConfigState,
  TemporalLayerState,
} from '@/store/LayersState';
import { ViewState } from '@/store/ViewState';

import { useRouter } from 'next/router';
import { getDataById } from '@/components/LayerFilter/menu';

import { DeckState, MapClickPositionState } from '../../store/ViewState';

const getViewStateFromMaplibre = (map) => {
  const { lng, lat } = map.getCenter();
  return {
    longitude: lng,
    latitude: lat,
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
};

/**
 * MapLibre GL JSの初期スタイルを取得する
 * 初期スタイル=./src/assets/backgrounds.jsonで定義された背景が表示されている状態
 */
const getInitialStyle = (backgrounds: Backgrounds): Style => {
  const defaultBackgroundData = backgrounds[Object.keys(backgrounds)[0]];
  const style: Style = {
    version: 8,
    sources: {
      background: defaultBackgroundData.source,
    },
    layers: [
      {
        id: 'background',
        type: 'raster',
        source: 'background',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
  return style;
};

const useInitializeMap = (
  maplibreContainer: React.MutableRefObject<HTMLDivElement | null>,
  deckglContainer: React.MutableRefObject<HTMLCanvasElement | null>,
  preferences: Preferences | null
) => {
  // @ts-ignore
  const { backgrounds, initialView } = preferences;
  const [currentZoomLevel, setCurrentZoomLevel] = useState(0);
  const setRecoilViewState = useSetRecoilState(ViewState);
  const deckGLRef = useRef<any>();
  const mapRef = useRef<any>();
  useEffect(() => {
    if (!mapRef.current) {
      if (!maplibreContainer.current) return;
      mapRef.current = new Map({
        container: maplibreContainer.current,
        style: getInitialStyle(backgrounds),
        center: initialView.map.center,
        zoom: initialView.map.zoom,
        bearing: initialView.map.bearing,
        pitch: initialView.map.pitch,
        //deck.gl側にマップの操作を任せるためにfalseに設定
        interactive: false,
      });
    }

    const gl = mapRef.current.painter.context.gl;
    deckGLRef.current = new Deck({
      initialViewState: {
        latitude: initialView.map.center[1],
        longitude: initialView.map.center[0],
        bearing: initialView.map.bearing,
        pitch: initialView.map.pitch,
        zoom: initialView.map.zoom,
      },
      canvas: deckglContainer.current!,
      controller: { doubleClickZoom: false, touchRotate: true },
      onViewStateChange: ({ viewState }) => {
        mapRef.current.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch,
        });
        setCurrentZoomLevel(viewState.zoom);
        setRecoilViewState(viewState);
      },
      layers: [],
    });

    mapRef.current.addControl(new NavigationControl());

    mapRef.current.on('moveend', (_e) => {
      deckGLRef.current.setProps({ initialViewState: getViewStateFromMaplibre(mapRef.current) });
    });
  }, []);
  return {
    deckGLRef,
    mapRef,
    currentZoomLevel,
  };
};

const useDeckGLLayer = (currentZoomLevel: number, config) => {
  const deckglLayers = useRecoilValue(LayersState);
  const temporalLayers = useRecoilValue(TemporalLayerState);
  const dL = deckglLayers.map((layer) => {
    return layer.clone({
      visible: !layer.props || !layer.props.minzoom || layer.props.minzoom <= currentZoomLevel,
    });
  });
  const tdL = temporalLayers.map((layer) => {
    return layer.clone({
      visible: !layer.props || !layer.props.minzoom || layer.props.minzoom <= currentZoomLevel,
    });
  });
  return [...dL, ...tdL]
    .map((layer) => {
      if (getLayerConfigById(layer.id, config)?.type === 'geojsonicon') {
        return { index: 1, layer: layer };
      } else {
        return { index: 0, layer: layer };
      }
    })
    .sort((a, b) => a.index - b.index)
    .map((obj) => {
      return obj.layer;
    });
};

const MapComponent: React.FC = () => {
  const maplibreContainer = useRef<HTMLDivElement | null>(null);
  const deckglContainer = useRef<HTMLCanvasElement | null>(null);
  const { preferences } = useContext(context);

  const temporalLayerConfigs = useRecoilValue(TemporalLayerConfigState);

  const setMapClickPosition = useSetRecoilState(MapClickPositionState);
  const setDeck = useSetRecoilState(DeckState);

  // Map の画面サイズ
  const [mapDimensions, setMapDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  // const mapAreaRef = useRef<HTMLDivElement | null>(null);

  //map・deckインスタンスを初期化
  const { deckGLRef, mapRef, currentZoomLevel } = useInitializeMap(
    maplibreContainer,
    deckglContainer,
    preferences
  );

  useEffect(() => {
    setDeck(deckGLRef.current);
  }, [deckGLRef, setDeck]);

  // @ts-ignore
  const deckglLayers = useDeckGLLayer(currentZoomLevel, preferences.config);
  //クリックされたレイヤに画面移動
  useFlyTo(deckGLRef.current);

  // 各種レイヤーの統合
  if (deckGLRef.current) {
    deckGLRef.current.setProps({
      layers: [...deckglLayers],
    });
  }

  const router = useRouter();

  useEffect(() => {
    if (maplibreContainer?.current) {
      setMapDimensions({
        width: maplibreContainer.current.offsetWidth,
        height: maplibreContainer.current.offsetHeight,
      });
    }
  }, [
    maplibreContainer,
    maplibreContainer.current?.offsetWidth,
    maplibreContainer?.current?.offsetHeight,
  ]);

  const onMapClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = { x: e.clientX - rect.x, y: e.clientY - rect.y };
    setMapClickPosition(pos);
  };

  return (
    <>
      <div className="h-full" ref={maplibreContainer}>
        <div onClick={onMapClick}>
          <canvas className="z-10 absolute h-full" ref={deckglContainer}></canvas>
        </div>
        <div className="z-10 absolute top-2 left-2 w-60 rounded">
          <Legend id={useGetClickedLayerId()} />
        </div>
        <div className="z-20 absolute bottom-0 right-0 w-80">
          <Info id={useGetInfoClickedLayerId()} />
        </div>
        <div className="z-10 absolute top-2 right-12 bg-white p-1 rounded">
          <div className="text-center font-bold">背景</div>
          <BackgroundSelector map={mapRef.current} />
        </div>
        <div className="z-10 absolute bottom-0 left-0 w-2/5 bg-white">
          {temporalLayerConfigs.length ? <TimeSlider /> : null}
        </div>
      </div>
    </>
  );
};

export default MapComponent;
