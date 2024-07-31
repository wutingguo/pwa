import cls from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import { UPLOAD_AI_MAPPING_DRAWER } from '@apps/live-photo-client-mobile/constants/modalTypes';
import AIIcon from '@apps/live-photo-client-mobile/icons/AI.png';

import './index.scss';

export default function AIRecognitionBtn(props) {
  const { boundGlobalActions, envUrls } = props;
  const baseUrl = envUrls.get('saasBaseUrl');
  // 获取活动信息
  const activityInfo = useSelector(state => state.activityInfo.get('ai_face_vo')?.toJS());

  function showAIRecognition() {
    const { showModal, hideModal } = boundGlobalActions;
    showModal(UPLOAD_AI_MAPPING_DRAWER, {
      handleClose: () => {
        hideModal(UPLOAD_AI_MAPPING_DRAWER);
      },
      baseUrl,
    });
  }

  /**
   * 不开启自动人脸识别，不显示
   */
  if (!activityInfo?.query_by_pic) {
    return null;
  }

  return (
    <div className={cls('ai_recognition_btn')} onClick={showAIRecognition}>
      <img src={AIIcon} className="image" />
    </div>
  );
}
