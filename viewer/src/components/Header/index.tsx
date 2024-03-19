import React, { useContext, Dispatch, SetStateAction } from 'react';
import { context } from '@/pages/_app';
import { Preferences } from '@/components/LayerFilter/loader';

type Props = {
  setPreferrence: Dispatch<SetStateAction<Preferences | null>>;
};

const Header: React.FC<Props> = () => {
  const { preferences } = useContext(context);
  if (preferences === null) return null;
  const headerStyle = {
    //backgroundColor: preferences.settings.background_color,
    backgroundColor: '#00BEBE',
  };

  return (
    <header style={headerStyle} className="h-full flex justify-left items-center">
      <>
        <div className="text-left text-white text-xl p-3 w-9/12">
          {preferences.settings.title}
        </div>
        <div className="text-right text-white font-semibold text-3l p-3 w-3/12">
          Powered By 国土交通省
        </div>
      </>
    </header>
  );
};

export default Header;
