import React from 'react';
import { useLocation } from 'react-router-dom';
import XLayout from '@src/components/XLayout';

export default Comp => {
  return props => {
    const location = useLocation();
    const layoutProps = {
      ...props,
      isShowSiderbar: true
    };
    return (
      <XLayout {...layoutProps}>
        <Comp {...props} />
      </XLayout>
    );
  };
};
