import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Rnd } from 'react-rnd';

type Props = {
  title?: string;
  width?: number | string;
  height?: number | string;
  defaultPosition?: { x: number; y: number };
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  movable?: boolean;
};

/**
 * フレキシブルなウインドウパネル
 */
const FlexibleWindowPanel = (props: Props) => {
  if (!props.defaultPosition) return null;

  return (
    <div className="z-10 absolute">
      <Rnd
        default={{
          x: props.defaultPosition.x,
          y: props.defaultPosition.y,
          width: props.width ?? 0,
          height: props.height ?? 0,
        }}
        disableDragging={!props.movable}
      >
        <Box sx={{ backgroundColor: '#00BEBE' }} className="title p-1 rounded-t">
          <div className="text-white ml-1 text-xs">{props.title}</div>
        </Box>
        {props.header && (
          <Box top="0" bgcolor="white">
            {props.header}
          </Box>
        )}
        <Box
          className={`bg-white px-2 w-full overflow-hidden ${
            !props.footer ? 'rounded-b' : 'overflow-y-scroll'
          }`}
          height={`calc(100% - ${props.footer ? (props.header ? 118 : 74) : 24}px)`}
        >
          {props.children}
        </Box>
        {props.footer && (
          <Box height="50px" bottom="0" bgcolor="white" className="rounded-b">
            {props.footer}
          </Box>
        )}
      </Rnd>
    </div>
  );
};

export default FlexibleWindowPanel;
