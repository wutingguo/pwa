import React, { useEffect } from 'react';
import { useRouteMatch, withRouter } from 'react-router';

import XLayout from '@src/components/XLayout';

import BypassAccount from './BypassAccount';

import './index.scss';

function Authority(props) {
  const layoutProps = {
    ...props,
    isFullContainer: true,
    isShowSiderbar: true,
  };
  return (
    <XLayout {...layoutProps}>
      <BypassAccount {...props} />
    </XLayout>
  );
}

export default withRouter(Authority);
