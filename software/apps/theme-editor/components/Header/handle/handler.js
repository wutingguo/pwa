import React from 'react';

import { elementTypes } from '@resource/lib/constants/strings';

import { PROGERSS_MODAL } from '@apps/theme-editor/constants/modalTypes';

import { goBack } from '../../../utils/history';

export function saveTheme(that) {
  const { boundGlobalActions, boundProjectActions } = that.props;
  window.logEvent.addPageEvent({
    name: 'UploadTheam_PreviewPop_Click_StillSave',
  });
  boundGlobalActions.showModal(PROGERSS_MODAL);
}

export function onSave(that) {
  window.logEvent.addPageEvent({
    name: 'UploadThemeEdit_Click_Save',
  });
  const { pageArray, boundGlobalActions, boundProjectActions } = that.props;
  const firstHasNoPhotoPageIndex =
    pageArray.size &&
    pageArray.findIndex(page => {
      const isHasPhotoEle = page.get('elements').some(ele => {
        return ele.get('type') === elementTypes.photo;
      });
      return !isHasPhotoEle;
    });
  let params = {};
  if (firstHasNoPhotoPageIndex !== -1) {
    params = {
      message: (
        <div style={{ textAlign: 'left' }}>
          部分页面未设置照片框，保存后无法应用照片，是否去设置？
        </div>
      ),
      buttons: [
        {
          className: 'white',
          onClick: that.saveTheme,
          text: '保存',
        },
        {
          onClick: () => {
            boundProjectActions.switchSheet(firstHasNoPhotoPageIndex);
            boundGlobalActions.hideConfirm();
          },
          text: '去设置',
        },
      ],
    };
  } else {
    params = {
      message: <div style={{ textAlign: 'left' }}>主题将按当前效果保存，是否确认？</div>,
      buttons: [
        {
          onClick: boundGlobalActions.hideConfirm,
          text: '取消',
          className: 'white',
        },
        {
          onClick: that.saveTheme,
          text: '确认',
        },
      ],
    };
  }
  boundGlobalActions.showConfirm({
    close: () => {
      boundGlobalActions.hideConfirm();
    },
    ...params,
  });
}

export function onLeave(that) {
  window.logEvent.addPageEvent({
    name: 'UploadThemeEdit_Click_Back',
  });
  const isAllowBack = window.confirm('系统可能不会保存您所做的更改。');

  if (isAllowBack) {
    // const urlParams = window.location.search;
    // if (urlParams.includes('virtualProjectGuid') && urlParams.includes('from=saas')) {
    //   window.location.pathname = '/prod-assets/app/cxeditor/index.html';
    // } else {
    //   goBack();
    // }
    // 不用再回跳至编辑器
    goBack();
  }
}

export function onEditTitle(that, title) {
  const { boundProjectActions } = that.props;
  boundProjectActions.updateProjectProperty({ title });
}
