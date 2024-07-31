import React, { useState } from 'react';

import XButton from '@resource/components/XButton';

import { aiMattingMessageType } from '@resource/lib/constants/strings';

import { sendMessageToWindow } from '@apps/ai-matting/utils/window';

import getPrefixCls from '../../utils/getPrefixCls';
import SwitchItem from '../SwitchItem';

import './index.scss';

const prefixCls = getPrefixCls('control-panel');

export default function ControlPanel({
  property,
  boundGlobalActions,
  boundProjectActions,
  showRetryModal,
  onCancel,
}) {
  const { isOpenMatting } = property.toJS();
  const onMattingSwitch = checked => {
    boundProjectActions.updateProperty({ isOpenMatting: checked });
  };

  const apply = () => {
    window.logEvent.addPageEvent({
      name: 'DesignerEditor_ImageMatting_ClickApply',
    });
    //因为该项目是以弹窗的形式去展示的，所以为避免事件丢失，需要强制上传
    window.logEvent.forceUpload();
    //如果关闭了抠图，点击应用，则需要清除元素上的抠图信息
    if (!isOpenMatting) {
      sendMessageToWindow({
        type: aiMattingMessageType.CLEAR_IMAGE_MATTING,
      });
      return;
    }
    boundGlobalActions.showGlobalLoading();
    boundProjectActions
      .applyMatting()
      .then(updateElement => {
        sendMessageToWindow({
          type: aiMattingMessageType.APPLY_IMAGE_MATTING,
          ...updateElement,
        });
      })
      .catch(e => {
        showRetryModal({
          message: '应用失败，请重试',
          onConfirm: apply,
        });
      })
      .finally(() => {
        boundGlobalActions.hideGlobalLoading();
      });
  };

  const cancel = () => {
    window.logEvent.addPageEvent({
      name: 'DesignerEditor_ImageMatting_ClickCancel',
    });
    window.logEvent.forceUpload();
    onCancel?.();
  };

  const footerHtml = (
    <div className={`${prefixCls}-footer`}>
      <XButton className="white" width={116} height={34} onClicked={cancel}>
        {t('CANCEL')}
      </XButton>
      <XButton width={116} height={34} onClicked={apply}>
        {t('APPLY_1')}
      </XButton>
    </div>
  );

  return (
    <div className={prefixCls}>
      <SwitchItem label={t('ONE_KEY_CUT')} onSwitch={onMattingSwitch} checked={isOpenMatting} />
      {footerHtml}
    </div>
  );
}
