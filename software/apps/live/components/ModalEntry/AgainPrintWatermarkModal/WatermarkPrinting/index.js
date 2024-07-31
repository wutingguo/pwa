import React, { useEffect, useRef } from 'react';

import FButton from '@apps/live/components/FButton';
import { LIVE_CONFIRM_MODAL } from '@apps/live/constants/modalTypes';
import { cancelRewatermarkTaskStatus } from '@apps/live/services/photoLiveSettings';
import { queryRewatermarkTaskStatus } from '@apps/live/services/photoLiveSettings';

import { Container } from './layout';

export default function WatermarkPrinting(props) {
  const { intl, handleClose, boundGlobalActions, baseUrl, baseInfo } = props;

  const timer = useRef(null);

  useEffect(() => {
    getWatermarkTaskStatus();
    return () => {
      clearTimeout(timer.current);
    };
  }, [baseInfo?.enc_album_id]);

  function getWatermarkTaskStatus() {
    timer.current = setTimeout(() => {
      queryRewatermarkTaskStatus({ baseUrl, enc_album_id: baseInfo?.enc_album_id }).then(res => {
        if (res === 1 || res === 0) {
          getWatermarkTaskStatus();
        } else {
          handleClose?.();
        }
      });
    }, 5000);
  }
  function stopClick() {
    boundGlobalActions.showModal(LIVE_CONFIRM_MODAL, {
      title: '',
      content: <div style={{ marginTop: 40 }}>{intl.tf('LP_WATERMARK_PRINTING_STOP_TIPS')}</div>,
      onClose: () => boundGlobalActions.hideModal(LIVE_CONFIRM_MODAL),
      onConfirm,
    });

    async function onConfirm() {
      try {
        const params = {
          baseUrl,
          enc_album_id: baseInfo?.enc_album_id,
        };
        await cancelRewatermarkTaskStatus(params);
        clearTimeout(timer.current);
        boundGlobalActions.hideModal(LIVE_CONFIRM_MODAL);
        handleClose?.();
      } catch (error) {
        console.log('🚀 ~ onConfirm ~ error:', error);
        handleClose?.();
      }
    }
  }
  return (
    <Container>
      <div className="content">{intl.tf('LP_WATERMARK_PRINTING')}...</div>
      <div className="bottom_btns">
        <FButton className="btn_cancel" onClick={stopClick}>
          {intl.tf('LP_WATERMARK_STOP')}
        </FButton>
        <FButton className="btn_next" onClick={handleClose}>
          {intl.tf('LP_WATERMARK_HIDE_WINDOW')}
        </FButton>
      </div>
    </Container>
  );
}
