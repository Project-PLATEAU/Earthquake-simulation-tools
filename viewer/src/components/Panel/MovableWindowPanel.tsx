import React, { ReactNode } from 'react';
import CloseButton from '@/components/Utils/CloseButton';
import Draggable from 'react-draggable';

type Props = {
  title?: string;
  titleBarColor?: string;
  darkmode?: boolean;
  width?: number;
  height?: number;
  x?: 'left' | 'center' | 'right';
  y?: 'top' | 'middle' | 'bottom';
  onClose?: () => void;
  children?: ReactNode;
};

/**
 * ドラッグで移動可能なウインドウパネル
 */
const MovableWindowPanel = (props: Props) => {
  let classX = 'left-2';
  if (props.x === 'left') {
    classX = 'left-2';
  }
  if (props.x === 'center') {
    classX = 'left-1/2';
  }
  if (props.x === 'right') {
    classX = 'right-2';
  }
  let classY = 'top-2';
  if (props.y === 'top') {
    classY = 'top-2';
  }
  if (props.y === 'middle') {
    classY = 'top-1/2';
  }
  if (props.y === 'bottom') {
    classY = 'bottom-2';
  }

  const width = props.width ?? 384;
  const height = props.height ?? 0;

  let defaultPositionX = 0;
  if (props.x === 'center') defaultPositionX = -width / 2;
  let defaultPositionY = 0;
  if (props.y === 'middle') defaultPositionY = -height / 2;

  return (
    <>
      <Draggable cancel=".body" defaultPosition={{ x: defaultPositionX, y: defaultPositionY }}>
        <div style={{ width: width }} className={`z-[60] absolute ${classX} ${classY}`}>
          <div
            style={{ backgroundColor: props.titleBarColor ?? '#00BEBE' }}
            className="title p-1 cursor-move rounded-t"
          >
            <div className="absolute top-1 right-1">
              <CloseButton onClick={props.onClose} darkmode={props.darkmode} />
            </div>
            <div className={`${props.darkmode ? 'text-white' : 'text-black'} ml-1`}>
              {props.title}
            </div>
          </div>
          <div className="body px-2 pb-2 pt-1 bg-white opacity-90 rounded-b">{props.children}</div>
        </div>
      </Draggable>
    </>
  );
};

export default MovableWindowPanel;
