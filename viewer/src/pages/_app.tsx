import '../styles/globals.css';
import '../styles/styles.css';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import React, { createContext, useState } from 'react';
import { Preferences } from '@/components/LayerFilter/loader';
import { clickedLayerViewState } from '@/components/Map/types';
import { MouseTooltipData } from '@/components/MouseTooltip';
import { defaultLegendId } from '@/components/Map/Legend/layerIds';
import { defaultInfoId } from '@/components/Map/Info/layerIds';

type TContext = {
  checkedLayerTitleList: string[];
  setCheckedLayerTitleList: React.Dispatch<React.SetStateAction<string[]>>;
  displayedLegendLayerId: string;
  setDisplayedLegendLayerId: React.Dispatch<React.SetStateAction<string>>;
  displayedInfoLayerId: string;
  setDisplayedInfoLayerId: React.Dispatch<React.SetStateAction<string>>;
  clickedLayerViewState: clickedLayerViewState | null;
  setClickedLayerViewState: React.Dispatch<React.SetStateAction<clickedLayerViewState | null>>;
  isDefault: boolean;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;
  mouseTooltipData: MouseTooltipData | null;
  setMouseTooltipData: React.Dispatch<React.SetStateAction<MouseTooltipData | null>>;
  preferences: Preferences | null;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences | null>>;
};

const useContextValues = (): TContext => {
  const [checkedLayerTitleList, setCheckedLayerTitleList] = useState<string[]>([]);
  const [displayedLegendLayerId, setDisplayedLegendLayerId] = useState<string>(defaultLegendId);
  const [displayedInfoLayerId, setDisplayedInfoLayerId] = useState<string>(defaultInfoId);
  const [clickedLayerViewState, setClickedLayerViewState] = useState<clickedLayerViewState | null>(
    null
  );
  const [isDefault, setIsDefault] = useState<boolean>(true);
  const [mouseTooltipData, setMouseTooltipData] = useState<MouseTooltipData | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  return {
    checkedLayerTitleList,
    setCheckedLayerTitleList,
    displayedLegendLayerId,
    setDisplayedLegendLayerId,
    displayedInfoLayerId,
    setDisplayedInfoLayerId,
    clickedLayerViewState,
    setClickedLayerViewState,
    isDefault,
    setIsDefault,
    mouseTooltipData,
    setMouseTooltipData,
    preferences,
    setPreferences,
  };
};

export const context = createContext({} as TContext);

function MyApp({ Component, pageProps }: AppProps) {
  const contextValues = useContextValues();

  return (
    <>
      <Head>
        <title>{contextValues?.preferences?.settings.title}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+1p&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="icon" sizes="16x16" href="/favicon.ico" />
      </Head>
      <RecoilRoot>
        <context.Provider value={{ ...contextValues }}>
            <Component {...pageProps} />
        </context.Provider>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
