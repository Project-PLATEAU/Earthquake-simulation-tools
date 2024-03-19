import { ReactNode, useContext } from 'react';
import { context } from '@/pages/_app';

type Props = {
  title: string;
  children?: ReactNode;
  direction: 'top' | 'right' | 'bottom' | 'left';
};

const Tooltip = (props: Props) => {
  let direction = ['left-full'];
  if (props.direction === 'top') {
    direction = ['bottom-full', 'mb-1', 'left-1/2', '-translate-x-1/2'];
  }
  if (props.direction === 'right') {
    direction = ['left-full', 'ml-1', 'top-1/2', '-translate-y-1/2'];
  }
  if (props.direction === 'bottom') {
    direction = ['top-full', 'mt-1', 'left-1/2', '-translate-x-1/2'];
  }
  if (props.direction === 'left') {
    direction = ['right-full', 'mr-1', 'top-1/2', '-translate-y-1/2'];
  }

  const className = [
    'whitespace-nowrap',
    'rounded',
    'bg-black',
    'px-2',
    'py-1',
    'text-white',
    'absolute',
    'opacity-0',
    'group-hover:opacity-100',
    'pointer-events-none',
    'z-10',
  ]
    .concat(direction)
    .join(' ');

  return (
    <div className="relative group">
      <span className={className}>{props.title}</span>
      {props.children}
    </div>
  );
};

export default Tooltip;
