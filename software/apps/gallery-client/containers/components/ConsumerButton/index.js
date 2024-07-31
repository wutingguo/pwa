import React, { memo, useCallback, useState } from 'react';
import classnames from 'classnames';
import { XIcon, XDropdown } from '@common/components';
import Popover from './Popover';
import OutLogin from './OutLogin';
import useLogin from '../../../hooks/useLogin';

import './index.scss';

const ConsumerButton = ({
  className,
  style = {},
  size = '',
  isShowPrintStore,
  boundGlobalActions,
  boundProjectActions
}) => {
  const [state, setState] = useState({
    popVisible: false
  });

  const { checkIsLoginByServer, showLoginModal, checkGalleryIsLogin, loginGallery } = useLogin({
    boundGlobalActions,
    boundProjectActions
  });

  const set = useCallback((payload = {}) => {
    setState(v => ({ ...v, ...payload }));
  }, []);

  const handleClick = useCallback(async () => {
    if (isShowPrintStore) {
      const isLogion = await checkIsLoginByServer();
      if (!isLogion) {
        showLoginModal({
          onLoginSuccess: () => {
            set({ popVisible: !!state.popVisible });
          }
        });
      } else {
        set({ popVisible: !state.popVisible });
      }
    } else {
      const galleryIsLogion = await checkGalleryIsLogin();
      if (!galleryIsLogion) {
        await loginGallery();
        set({ popVisible: !!state.popVisible });
      } else {
        set({ popVisible: !state.popVisible });
      }
    }
  }, [checkIsLoginByServer, showLoginModal, state]);

  const handlePopVisible = useCallback(v => {
    set({ popVisible: !!v });
  }, []);

  const handlePopClose = useCallback(() => {
    set({ popVisible: false });
  }, []);

  const { popVisible } = state;

  const clName = classnames('print-store-consumer-button', className);
  const sizeSuffix = size ? `-${size}` : '';

  return (
    <Popover
      className="print-store-consumer-popover"
      visible={popVisible}
      container="#app"
      onVisibleChange={handlePopVisible}
      offsetTop={8}
      Target={
        <span className={clName} style={style} onClick={handleClick}>
          <XIcon type={`user${sizeSuffix}`} className="order-icon-wrap" title="" />
        </span>
      }
    >
      <OutLogin
        closePop={handlePopClose}
        boundGlobalActions={boundGlobalActions}
        boundProjectActions={boundProjectActions}
      />
    </Popover>
  );
};

export default memo(ConsumerButton);
