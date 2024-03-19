import React, { ReactNode, VFC, useContext } from 'react';
import { context } from '@/pages/_app';
import Collapsible from 'react-collapsible';
import { getDataById, getCategoryByTitle, getDataTitleById } from '@/components/LayerFilter/menu';
import { largeDownloadIcon, shareIcon, linkIcon } from '@/components/SideBar/Icon';
import { useRecoilValue } from 'recoil';
import { TooltipDataState } from '@/store/TooltipState';
import { getPropertiesObj } from '@/components/Tooltip/util';

type BaseTooltipProps = { children: ReactNode };

const tdStyle = {
  paddingRight: '35px',
};

const BaseTooltip: VFC<BaseTooltipProps> = ({ children }) => {
  const { preferences } = useContext(context);
  const toolchipContentStyle = {
    // @ts-ignore
    backgroundColor: preferences.settings.tooltip_background_color,
  };
  return (
    <div id="tooltip_content" className="bg-white h-full" style={toolchipContentStyle}>
      {children}
    </div>
  );
};

type TooltipBodyProps = {
  properties: any;
  labels: string[];
};

type TooltipThumbnailBodyProps = {
  properties: any;
  labels: string[];
  id: string;
};

type TooltipTableBodyProps = {
  properties: any;
  labels: string[];
  id: string;
};

export const Tooltip: VFC = () => {
  const tooltipData = useRecoilValue(TooltipDataState);
  if (!tooltipData) {
    return null;
  }
  const {
    data: { properties, labels },
    tooltipType,
    id,
  } = tooltipData;

  return (
    <div className={'relative overflow-auto h-full max-w-lg max-h-[500px] rounded'}>
      <BaseTooltip>
        {(() => {
          switch (tooltipType) {
            case 'default':
              return <TooltipDefaultBody {...{ properties: properties, labels: labels }} />;
            case 'thumbnail':
              return (
                <TooltipThumbnailBody {...{ properties: properties, labels: labels, id: id }} />
              );
            case 'table':
              return <TooltipTableBody {...{ properties: properties, labels: labels, id: id }} />;
            default:
              return <TooltipDefaultBody {...{ properties: properties, labels: labels }} />;
          }
        })()}
      </BaseTooltip>
    </div>
  );
};

const TooltipDefaultBody: VFC<TooltipBodyProps> = ({ properties, labels }) => {
  return (
    <table className="tooltip_table">
      <tbody>
        {labels.map((key) => {
          const value = String(properties[key]);
          // "画像"というkeyでかつURLを持っている場合は画像を表示する・それ以外は文字列として表示する
          let content: JSX.Element | string;

          content = value;

          if (key === '画像' || key === '写真' || key === 'サムネイル') {
            content = 'N/A';
            if (value.startsWith('http')) content = <img src={value} />; // 値がURLではない場合があるのでチェック
          }
          if ((key === 'URL' || key === '関連URL') && value !== 'null') {
            content = (
              <a
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                href={value}
                target="TOP"
              >
                {value}
              </a>
            );
          }
          if (key === 'HP' || key === 'YouTubeリンク') {
            content = (
              <a
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                href={value}
                target="TOP"
              >
                リンク
              </a>
            );
          }
          // ゼンリン建物のhousenameは表示しない
          if (key === 'housename') {
            content = '';
          }

          // ゼンリンのマジックネームを修正
          switch (key) {
            case 'acode':
              key = '大字コード ';
              break;
            case 'ccode':
              key = '字丁目コード';
              break;
            case 'overlap':
              key = '図跨り符号';
              break;
            case 'together':
              key = '同居人符号';
              break;
            case 'chiban':
              key = '地番または戸番';
              break;
            case 'housename':
              key = '建物名称';
              break;
            case 'hyosatu_id':
              key = '表札ID';
              break;
            case 'layerName':
              key = 'レイヤー名';
              break;
            case 'tatemon_id':
              key = 'ユーザID';
              break;
            case 'kcode':
              key = '拡張市町村コード';
              break;
            case 'gcode':
              key = '街区コード';
              break;
            case 'laynum':
              key = 'レイヤ番号';
              break;
            case 'zmdatr_id':
              key = '図内属性番号';
              break;
            case 'atrcode':
              key = '属性種別コード';
              break;
            case 'bmap_id':
              key = '関連図番号';
              break;
            case 'floor':
              key = '階数';
              break;
            case 'bekkire_id':
              key = '別記番号';
              break;
            case 'map_id':
              key = '図番号';
              break;
          }

          return (
            <tr key={key}>
              <td className="whitespace-nomal break-all font-bold w-24 border-solid border px-2">
                {key}
              </td>
              <td
                className="whitespace-nomal break-all w-64 border-solid border px-2"
                style={tdStyle}
              >
                {content}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TooltipThumbnailBody: VFC<TooltipThumbnailBodyProps> = ({ properties, labels, id }) => {
  //todo jsonに移動
  const summaryKey = {
    title: ['話題提供者名', 'タイトル', '事業所名'],
    image: ['画像', '写真', 'サムネイル', 'image'],
    description: ['内容'],
  };

  const { preferences } = useContext(context);

  const { description, ..._summaryKey } = summaryKey;
  const summaryKeys = Object.keys(_summaryKey)
    .map((key) => {
      return summaryKey[key];
    })
    .flat();

  const infolabels = [...labels].filter((key) => summaryKeys.indexOf(key) === -1);

  const summary = () => {
    let titleValue =
      properties[
        labels.filter((key) => {
          return summaryKey.title.indexOf(key) > -1;
        })[0]
      ];

    const imageValue =
      properties[
        labels.filter((key) => {
          return summaryKey.image.indexOf(key) > -1;
        })[0]
      ];

    // @ts-ignore
    let layerTitle = getDataTitleById(preferences.menu, id);
    // @ts-ignore
    const resource = getDataById(preferences.menu, [id]);

    const image = () => {
      let content: JSX.Element | string;
      content = 'N/A';

      if (imageValue.startsWith('http'))
        content = (
          <img
            className="w-full"
            src={imageValue}
            style={{
              objectFit: 'cover',
              objectPosition: '50% 50%',
              height: 'calc(50%)',
            }}
          />
        );
      return content;
    };

    let place: string | JSX.Element = '';
    let address: string | JSX.Element = '';
    let tel: string | JSX.Element = '';
    if (layerTitle === '地域づくり協議会境界データ') {
      titleValue = <div className="text-left font-bold">{properties['名称']}</div>;
      layerTitle = '';
      place = <div className="text-m text-left">{'拠点：' + properties['拠点']}</div>;
      address = <div className="text-m text-left">{'住所：' + properties['住所']}</div>;
      tel = <div className="text-m text-left">{'TEL：' + properties['TEL']}</div>;
    } else {
      titleValue = <div className="text-center font-bold">{titleValue}</div>;
    }

    const descriptionValue: string | undefined =
      properties[
        labels.filter((key) => {
          return summaryKey.description.indexOf(key) > -1;
        })[0]
      ];
    return (
      <>
        {image()}
        <div className="pl-2 pr-2">
          {titleValue}
          <div className="text-xs text-gray-600 text-left">{layerTitle}</div>
          <div className="text-sm text-left">{descriptionValue}</div>

          {place}
          {address}
          {tel}

          <div className="flex flex-row justify-center">
            <div className="flex justify-center m-2">
              {resource.download_url === undefined
                ? undefined
                : largeDownloadIcon(resource.download_url)}
            </div>
            {/* <div className="flex justify-center m-2">
              {resource.download_url === undefined ? undefined : shareIcon(resource.download_url)}
            </div>
            <div className="flex justify-center m-2">
              {resource.download_url === undefined ? undefined : linkIcon(resource.download_url)}
            </div> */}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {summary()}
      {infolabels.length > 0 ? (
        <Collapsible
          trigger="詳細情報"
          triggerClassName="text-white bg-[#00BEBE] hover:opacity-75 text-sm p-1 text-center absolute w-full"
          triggerOpenedClassName="text-white bg-[#00BEBE] hover:opacity-75 text-sm p-1 text-center absolute w-full"
        >
          <table className="mt-8 tooltip_table m-2">
            <tbody>
              {infolabels.map((key) => {
                const value = String(properties[key]);

                let content: JSX.Element | string;
                content = value;
                if ((key === 'URL' || key === '関連URL') && value !== 'null') {
                  content = (
                    <a
                      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                      href={value}
                      target="TOP"
                    >
                      {value}
                    </a>
                  );
                }
                if (key === 'HP' || key === 'YouTubeリンク') {
                  content = (
                    <a
                      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                      href={value}
                      target="TOP"
                    >
                      リンク
                    </a>
                  );
                }

                return (
                  <tr key={key}>
                    <td className="whitespace-nomal font-bold align-top w-24">{key}</td>
                    <td className="whitespace-nomal break-all" style={tdStyle}>
                      {content}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Collapsible>
      ) : undefined}
    </>
  );
};

const TooltipTableBody: VFC<TooltipTableBodyProps> = ({ properties, labels, id }) => {
  //todo jsonに移動
  const summaryKey = {
    title: ['旧市区町村名'],
    dataset: [''],
    resource: [''],
  };

  const Summary = () => {
    const { preferences } = useContext(context);
    // @ts-ignore
    const layerTitle = getDataTitleById(preferences.menu, id);
    // @ts-ignore
    const layerCategory = getCategoryByTitle(preferences.menu, layerTitle);

    const titleValue =
      properties[
        labels.filter((key) => {
          return summaryKey.title.indexOf(key) > -1;
        })[0]
      ];

    return (
      <>
        <div className="px-2">{titleValue}</div>
        <div className="px-2 text-xs">{layerCategory}</div>
        <div className="px-2 font-bold">{layerTitle}</div>
      </>
    );
  };

  return (
    <>
      {Summary()}
      <table className="tooltip_table">
        <tbody>
          {labels.map((key) => {
            const summaryKeys = Object.keys(summaryKey)
              .map((key) => {
                return summaryKey[key];
              })
              .flat();
            const value = String(properties[key]);

            let content: JSX.Element | string;
            if (summaryKeys.indexOf(key) > -1) {
              return;
            } else {
              content = value;
            }

            if (key === '画像' || key === '写真' || key === 'サムネイル' || key === 'image_url') {
              content = 'N/A';
              if (value.startsWith('http')) content = <img src={value} />; // 値がURLではない場合があるのでチェック
            }
            if ((key === 'URL' || key === '関連URL') && value !== 'null') {
              content = (
                <a
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  href={value}
                  target="TOP"
                >
                  {value}
                </a>
              );
            }
            if (key === 'HP' || key === 'YouTubeリンク' || key === 'link_url') {
              content = (
                <a
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  href={value}
                  target="TOP"
                >
                  リンク
                </a>
              );
            }

            return (
              <tr key={key}>
                <td className="whitespace-nomal break-all font-bold align-top w-24 px-2 border-solid border">
                  {key}
                </td>
                <td className="whitespace-nomal break-all px-2 border-solid border" style={tdStyle}>
                  {content}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
