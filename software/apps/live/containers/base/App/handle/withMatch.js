import React from 'react';
import { useLocation } from 'react-router-dom';

import { InternationalProvide } from '@common/components/InternationalLanguage';

import XLayout from '@src/components/XLayout';

import getLanguage from './getLanguage';

const showSiderbarRouterList = [
  '/software/live/',
  '/software/live/photo',
  '/software/live/photo/',
  '/software/live/recycle-album',
];

export default Comp => {
  return props => {
    const location = useLocation();
    const pathname = location.pathname;
    const layoutProps = {
      ...props,
      isFullContainer: true,
      isShowSiderbar: showSiderbarRouterList.includes(pathname),
    };
    const lang = __isCN__ ? 'cn' : 'en';
    const initlang = getLanguage();
    return (
      <XLayout {...layoutProps}>
        <InternationalProvide lang={lang} initLang={initlang}>
          <Comp {...props} />
        </InternationalProvide>
      </XLayout>
    );
  };
};
