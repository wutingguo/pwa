import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import globalActions from '@resource/pwa-client/redux/actions';

/**
 * 使用全局boundGlobalActions方法
 */
const useBoundGlobalActions = () => {
  const dispatch = useDispatch();
  // 绑定全局action
  const boundGlobalActions = useMemo(() => bindActionCreators(globalActions, dispatch), [dispatch]);

  return boundGlobalActions;
};

export default useBoundGlobalActions;
