import React, { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { context } from '@/pages/_app';
import Header from '@/components/Header';
import Sidebar from '@/components/SideBar';
import MouseTooltip from '@/components/MouseTooltip';
import Map from '@/components/Map';
import Draggable from 'react-draggable';
import { Tooltip } from '@/components/Tooltip/content';
import { closeIcon } from '@/components/SideBar/Icon';
import { useRecoilState, useRecoilValue } from 'recoil';
import { TooltipDataState, TooltipPositionState } from '@/store/TooltipState';
import { LayersState } from '@/store/LayersState';
import {
  Backgrounds,
  fetchJson,
  InitialView,
  Preferences,
  Settings,
} from '@/components/LayerFilter/loader';
import { getDataById, Menu } from '@/components/LayerFilter/menu';
import { Config } from '@/components/LayerFilter/config';
import { useRouter } from 'next/router';

const App: NextPage = () => {
  const contextValues = useContext(context);
  const tooltipPosition = useRecoilValue(TooltipPositionState);
  const [tooltipData, setTooltipData] = useRecoilState(TooltipDataState);
  const router = useRouter();

  const toolChipBaseStyle: any = {
    backgroundColor: contextValues?.preferences?.settings.tooltip_background_color,
    position: 'absolute',
  };

  const init = () => {
    // preferencesが指定されているがqueryとして読み込みが完了していない場合はJSONの取得処理の開始を保留する
    if (router.asPath.includes('preferences=') && typeof router.query.preferences === 'undefined')
      return;
    if (
      router.asPath.includes('querySelectLayerId=') &&
      typeof router.query.querySelectLayerId === 'undefined'
    )
      return;

    (async () => {
      // クエリパラメータでpreferencesが指定されていればそのURLを
      // 指定されていなければデフォルト設定を読み込む
      let preferencesPath = router.query.preferences as string | undefined;
      if (typeof preferencesPath === 'undefined') {
        preferencesPath = `${router.basePath}/defaultPreferences`;
      }
      let loadedPreferences: Preferences;

      const results = await Promise.all([
        fetchJson(`${preferencesPath}/settings.json`),
        fetchJson(`${preferencesPath}/menu.json`),
        fetchJson(`${preferencesPath}/config.json`),
        fetchJson(`${preferencesPath}/backgrounds.json`),
        fetchJson(`${preferencesPath}/initial_view.json`),
      ]);

      loadedPreferences = {
        settings: results[0] as Settings,
        menu: results[1] as Menu,
        config: results[2] as Config,
        backgrounds: results[3] as Backgrounds,
        initialView: results[4] as InitialView,
      };

      // let querySelectLayerId = router.query.querySelectLayerId as string | undefined;
      // querySelectLayerId = querySelectLayerId === undefined ? '' : querySelectLayerId;
      // if (querySelectLayerId !== '') {
      //   let targetResource = getDataById(loadedPreferences.menu, [querySelectLayerId]);
      //   targetResource.checked = true;
      //   for (
      //     let categoryIndex = 0;
      //     categoryIndex < loadedPreferences.menu.length;
      //     categoryIndex++
      //   ) {
      //     const element = loadedPreferences.menu[categoryIndex];
      //     for (let dataIndex = 0; dataIndex < element.data.length; dataIndex++) {
      //       const resource = element.data[dataIndex];
      //       if (resource.id[0] === targetResource.id[0]) {
      //         loadedPreferences.menu[categoryIndex].data[dataIndex] = targetResource;
      //       }
      //     }
      //   }
      // }
      contextValues.setPreferences(() => loadedPreferences);
    })();
  };

  useEffect(() => {
    init();
  }, [
    router.asPath,
    router.basePath,
    router.query.preferences,
    router.query.querySelectLayerId,
    contextValues.setPreferences,
  ]);

  const [deckGLLayers, setDeckGLLayers] = useRecoilState(LayersState);
  useEffect(() => {
    setDeckGLLayers([]);
  }, [setDeckGLLayers]);

  if (contextValues.preferences === null) {
    return <div>loading</div>;
  }

  return (
    <>
      <div style={{ minWidth: '1280px' }}>
        <div className="h-12">
          <Header setPreferrence={contextValues.setPreferences} />
        </div>
        <div className="flex content" style={{ overflow: 'hidden' }}>
          <div className="flex flex-col h-full ml-4 mr-2 mt-4 pb-10" style={{ width: '240px' }}>
            <div id="sideBar" className="overflow-auto relative">
              <Sidebar preferences={contextValues.preferences} />
            </div>
            {contextValues.mouseTooltipData !== null ? (
              <div className="relative flex-1">
                <MouseTooltip mouseTooltipData={contextValues.mouseTooltipData} />
              </div>
            ) : undefined}
          </div>
          <div id="MapArea" className="relative m-2 pb-5 h-full flex-auto">
            <Map />
            {tooltipData && tooltipPosition && tooltipData.data ? (
              <Draggable bounds="parent" handle="#handle">
                <div className="z-50 rounded" style={{ ...tooltipPosition, ...toolChipBaseStyle }}>
                  <div id="handle" className="h-7 w-full cursor-move bg-[#00BEBE] rounded-t"></div>
                  <Tooltip />
                  <div className="text-right absolute top-0.5 right-2">
                    <button className="text-2xl bg-[#00BEBE]" onClick={() => setTooltipData(null)}>
                      {closeIcon()}
                    </button>
                  </div>
                </div>
              </Draggable>
            ) : undefined}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
