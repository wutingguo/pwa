import React, { memo, useCallback, useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import qs from 'qs';

import paypalUtil from '../../utils/payPal';

const sendMessage = status => {
  console.log('sendMessage', {
    status
  });
  if (status === 'success') {
    paypalUtil.postMessage({ success: true, status });
  } else {
    paypalUtil.postMessage({ success: false, status });
  }
  window.close();
};

const EstorePayment = () => {
  const { params = {} } = useRouteMatch();
  const { status } = params;

  console.log('route params', params);

  useEffect(() => {
    sendMessage(status);
  }, []);

  return <div>{status}</div>;
};

export default memo(EstorePayment);
