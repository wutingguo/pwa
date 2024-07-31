import React from 'react';
import { useLocation } from 'react-router-dom';
import XLayout from '@src/components/XLayout';

const notRenderPageRouterList = [
  '/software/slide-show/collection',
  '/software/slide-show/settings'
];

export default Comp => {
  return props => {
    const location = useLocation();
    const pathname = location.pathname;
    const layoutProps = {
      ...props,
      isShowSiderbar: false,
      isFullContainer: true
    };
    return (
      <XLayout {...layoutProps}>
        <Comp {...props} />
      </XLayout>
    );
  };
};
