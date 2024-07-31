import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { XModal } from '@common/components';

import { PROGERSS_MODAL } from '@apps/theme-editor/constants/modalTypes';

import { goBack } from '../../../utils/history';

import loadingImage from './icon/cunxin.gif';
import WarnImage from './icon/warn.png';

import './index.scss';

function ProgressModal(props) {
  const {
    onCloseModal,
    isShown,
    containerStyle,
    size,
    boundGlobalActions,
    boundProjectActions,
    pageArray,
  } = props;
  const [progress, setProgress] = useState(0);
  const sizeText = useRef('');
  const getSize = pageArray => {
    const firstPage = pageArray[0];
    const { width, height } = firstPage;
    let shape = '';
    const shapSizeMap = {
      square: '方版',
      portrait: '竖版',
      landscape: '横版',
    };
    const ratio = width / height;
    if (ratio > 2.1) {
      shape = 'landscape';
    }
    if (ratio <= 2.1 && ratio >= 1.9) {
      shape = 'square';
    }
    if (ratio < 1.9) {
      shape = 'portrait';
    }
    return shapSizeMap[shape];
  };
  const arr = pageArray.toJS();
  const page = arr[0];
  useEffect(() => {
    sizeText.current = getSize(pageArray?.toJS());
    boundProjectActions
      .saveTheme(setProgress)
      .then(themeCode => {
        onCloseModal && onCloseModal();
        const params = new URLSearchParams(window.location.search);
        const uploadThemeId = params.get('uploadThemeId');
        page?.themeCode &&
          window.logEvent.addPageEvent({
            name: 'DesignerMaterialMT_EndUploadTheme',
            themeCode: page.themeCode,
            uploadThemeId,
          });
        window.removeBeforeUnload && window.removeBeforeUnload();
        boundGlobalActions.showConfirm({
          close: () => {
            boundGlobalActions.hideConfirm();
            location.href = '/software/designer/my-materials';
            boundProjectActions.clearHistory();
          },
          message: (
            <div style={{ textAlign: 'left' }}>
              主题保存成功，可前往【主题模版-我的主题】查看 <br />
              注：当前主题为<strong>{sizeText.current}</strong>，您可在
              <strong>{sizeText.current}</strong>
              作品中应用该主题
            </div>
          ),
          buttons: [
            {
              onClick: () => {
                // const urlParams = window.location.search;
                // if (urlParams.includes('virtualProjectGuid') && urlParams.includes('from=saas')) {
                //   window.location.pathname = '/prod-assets/app/cxeditor/index.html';
                // } else {
                //   // goBack();
                //   location.href = '/software/designer/my-materials';
                //   boundProjectActions.clearHistory();
                // }
                // 不用再回跳至编辑器
                location.href = '/software/designer/my-materials';
                boundProjectActions.clearHistory();
              },
              text: '好的',
            },
          ],
        });
      })
      .catch(e => {
        onCloseModal && onCloseModal();
        boundGlobalActions.showConfirm({
          close: () => {
            boundGlobalActions.hideConfirm();
          },
          message: (
            <div style={{ textAlign: 'center' }}>
              <img style={{ width: '40px', height: '40px' }} src={WarnImage} alt="" />
              <p>抱歉，主题模版保存失败！</p>
              <p>可能是网络不稳定等原因导致，建议重试</p>
            </div>
          ),
          buttons: [
            {
              onClick: () => {
                boundGlobalActions.hideConfirm();
                boundGlobalActions.showModal(PROGERSS_MODAL);
              },
              text: '重试',
            },
          ],
        });
      });
  }, []);
  const modalProps = {
    className: 'x-progress-modal',
    containerStyle: containerStyle,
    onClosed: onCloseModal,
    opened: isShown,
    isHideIcon: true,
  };
  const iconClassName = classNames('icon', size);
  return (
    <XModal {...modalProps}>
      <div className="modal-body">
        <img alt="" className={iconClassName} src={loadingImage} />
        <div className="progress-container">主题模版保存进度{progress}%</div>
        <div className="loading-text">
          <span>正在为您保存，请耐心等待</span>
          <span>保存过程中请不要关闭此页面！</span>
        </div>
      </div>
    </XModal>
  );
}

export default ProgressModal;
