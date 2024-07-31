import React from 'react';
import { useLocation } from 'react-router-dom';
import XLayout from '@src/components/XLayout';
import { fullPages } from '@src/constants/strings';
import estoreModule from '@apps/estore/constants/estoreModule';

const notRenderPageRouterList = ['/software/e-store', '/software/e-store/'].concat(
  estoreModule.map(item => item.path)
);

export default Comp => {
  return props => {
    const location = useLocation();
    const pathname = location.pathname;
    const layoutProps = {
      ...props,
      isFullContainer: pathname && fullPages.includes(pathname),
      isShowSiderbar: !fullPages.includes(pathname)
    };
    return (
      <XLayout {...layoutProps}>
        <Comp {...props} />
      </XLayout>
    );
  };
};
