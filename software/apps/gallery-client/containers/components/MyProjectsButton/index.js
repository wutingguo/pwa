import React, { memo, useCallback, useState } from 'react';
import classnames from 'classnames';
import { XIcon, XDropdown } from '@common/components';
import Popover from './Popover';
import MyProjectList from './MyProjectList';
import useLogin from '../../../hooks/useLogin';

import './index.scss';

const MyProjectsButton = ({
  className,
  style = {},
  size = '',
  boundGlobalActions,
  boundProjectActions
}) => {
  const [state, setState] = useState({
    popVisible: false
  });

  const { checkIsLoginByServer, showLoginModal } = useLogin({
    boundGlobalActions,
    boundProjectActions
  });

  const set = useCallback((payload = {}) => {
    setState(v => ({ ...v, ...payload }));
  }, []);

  const handleClick = useCallback(async () => {
    window.logEvent.addPageEvent({
      name: 'ClientEstore_Click_SavedDesigns'
    });
    const isLogion = await checkIsLoginByServer();
    if (!isLogion) {
      showLoginModal({
        onLoginSuccess: () => {
          set({ popVisible: true });
        }
      });
    } else {
      set({ popVisible: !state.popVisible });
    }
  }, [checkIsLoginByServer, showLoginModal, state]);

  const handlePopVisible = useCallback(v => {
    set({ popVisible: !!v });
  }, []);

  const handlePopClose = useCallback(() => {
    set({ popVisible: false });
  }, []);

  const { popVisible } = state;

  const clName = classnames('print-store-my-projects-button', className);
  const sizeSuffix = size ? `-${size}` : '';

  return (
    <Popover
      className="print-store-my-projects-popover"
      visible={popVisible}
      container="#app"
      onVisibleChange={handlePopVisible}
      offsetTop={8}
      Target={
        <span className={clName} style={style} onClick={handleClick}>
          <XIcon
            type={`order${sizeSuffix}`}
            className="order-icon-wrap"
            title=""
            // status={currentSetFavoriteImageCount !== 0 ? 'active' : ''}
          />
        </span>
      }
    >
      <MyProjectList closePop={handlePopClose} boundGlobalActions={boundGlobalActions} />
    </Popover>
  );
};

export default memo(MyProjectsButton);
