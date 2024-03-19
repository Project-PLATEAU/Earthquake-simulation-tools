import { context } from '@/pages/_app';
import React, { useState, useContext, Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { getVisiblyContent } from '@/components/LayerFilter/sideBar';
import { Content } from '@/components/SideBar/Content';
import { Layers } from '@/components/SideBar/Content/Layers';
import { getFilteredMenu } from '@/components/LayerFilter/menu';
import { Preferences } from '@/components/LayerFilter/loader';

type Props = {
  onChangeSelect?: (layerId: string, selected: boolean) => void;
  preferences: Preferences;
};

const Sidebar = (props: Props) => {
  const { setCheckedLayerTitleList } = useContext(context);
  const [InputFilterKeyword, setInputFilterKeyword] = useState('');
  const filteredMenu = getFilteredMenu(props.preferences.menu, InputFilterKeyword);
  const visiblyContentList = getVisiblyContent(filteredMenu);
  // 初回レンダリング時にチェック済のレイヤータイトルを設定しておく
  useEffect(() => {
    setCheckedLayerTitleList(
      visiblyContentList
        .flatMap((content) => {
          return content.layers;
        })
        .filter((value) => value.checked)
        .map((value) => {
          return value.title;
        })
    );
  }, []);

  useEffect(() => {
    setCheckedLayerTitleList(
      visiblyContentList
        .flatMap((content) => {
          return content.layers;
        })
        .filter((value) => value.checked)
        .map((value) => {
          return value.title;
        })
    );
  }, [props.preferences]);

  return (
    <>
      {visiblyContentList.map((content) => (
        <Content
          title={content.title}
          layers={
            <Layers
              onChange={props.onChangeSelect}
              layers={content.layers}
            />
          }
          key={content.title}
        />
      ))}
    </>
  );
};

export default Sidebar;
