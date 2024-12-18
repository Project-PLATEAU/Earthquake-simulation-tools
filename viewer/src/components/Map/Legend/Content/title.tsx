import { context } from '@/pages/_app';
import React, { useContext } from 'react';
import { getDataTitleById } from '@/components/LayerFilter/menu';

type props = {
  id: string;
};

export const Title = (props: props) => {
  const { preferences } = useContext(context);
  if (preferences === null) return null;
  const { id } = props;
  const title = getDataTitleById(preferences.menu, id);
  return <p className="text-center font-bold">{title}</p>;
};
