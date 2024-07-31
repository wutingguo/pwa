import React, { memo, useEffect, useState } from 'react';

import { applyStatus } from '@common/servers/payWeChat';

import { XLoading, XModal } from '@common/components';

import * as localModalTypes from '@src/constants/modalTypes';

import PayFormInfo from '../../PayFormInfo';

import './index.scss';

const PayFormModal = props => {
  const { data } = props;
  const { baseUrl, boundGlobalActions, applystate, authenticateUrl, setApplyState } =
    data.toJS() || {};
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    applyStatus({ baseUrl }).then(data => {
      if (data && data.applyment_state) {
        setApplyState(data.applyment_state);
        // setApplyState('APPLYMENT_STATE_REJECTED');
        boundGlobalActions.hideModal(localModalTypes.PAY_FORM_MODAL);
      } else {
        // 当初次提交时 关闭弹窗提醒清空操作
        boundGlobalActions.showConfirm({
          close: () => {
            boundGlobalActions.hideConfirm();
          },
          title: '提示',
          message: '关闭页面可能导致数据未存储，是否关闭？',
          buttons: [
            {
              text: t('CANCEL'),
              className: 'white',
            },
            {
              text: t('CONFIRM'),
              onClick: () => boundGlobalActions.hideModal(localModalTypes.PAY_FORM_MODAL),
            },
          ],
        });
      }
    });
  };
  return (
    <XModal className="PayFormModal" opened onClosed={closeModal}>
      <XLoading type="listLoading" isShown={loading} backgroundColor="rgba(255,255,255,0.5)" />
      <PayFormInfo
        applystate={applystate}
        authenticateUrl={authenticateUrl}
        setLoading={setLoading}
        baseUrl={baseUrl}
        boundGlobalActions={boundGlobalActions}
      />
    </XModal>
  );
};

export default memo(PayFormModal);
