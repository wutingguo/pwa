import React, { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SIGN_IN_MODAL } from '@apps/commodity-client/constants/modalTypes';
import { getQs } from '@resource/lib/utils/url';
import * as cache from '@resource/lib/utils/cache';
import { emailReg, phoneReg } from '@resource/lib/constants/reg';
import { debounce } from 'lodash';

const useLogin = ({ boundGlobalActions, boundProjectActions }) => {
  const { urls, store, qs } = useSelector(storeState => {
    return {
      urls: storeState.root.system.env.urls,
      qs: storeState.root.system.env.qs,
      store: storeState.store
    };
  });


  return {};
};

export default useLogin;
