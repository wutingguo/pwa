// import React from 'react';
// import classNames from 'classnames';
// import { fromJS } from 'immutable';
// import { get, template, merge } from 'lodash';
import { cloneDeep } from 'lodash';

import { LIVE_PHOTO_VERIFY_WATERMARK } from '@common/constants/strings';

import { Authority } from '@common/utils/localStorage';

import {
  CUSTOM_FORM_MODAL,
  IMAGE_VIEWER_MODAL,
  SHARE_QRCODE_MODAL,
} from '@apps/live-photo-client-mobile/constants/modalTypes';

import service from './service';

// 本地存储第一次登记表单
const auth = new Authority();

const didMount = that => {
  const { currentSetId, sets } = that.state;
  const { activityDesc } = that.props;
  // 设置默认值
  if (!currentSetId && sets && sets.length > 0) {
    that.setState({
      currentSetId:
        sets[0].id == 'introduce' && activityDesc.get('menu_type') == 'LINK'
          ? sets[1].id
          : sets[0].id,
    });
  }
};

// 重新刷新加载数据
const reloadImages = that => {
  const { currentSetId, sets } = that.state;
  service.getContentList(that, true);
  service.getTimeSegmentGroup(that, true);
};

// 显示QRCode弹框.
const showShareQRCode = that => {
  const { boundGlobalActions, boundProjectActions, qs } = that.props;
  const { showModal, hideModal } = boundGlobalActions;
  showModal(SHARE_QRCODE_MODAL, {
    handleClose: () => {
      hideModal(SHARE_QRCODE_MODAL);
    },
  });
};

// 照片放大查看.
const showImageViewer = (that, index, images, option = {}) => {
  const { boundGlobalActions, boundProjectActions, qs, pageSetting, activityInfo } = that.props;
  const { showModal, hideModal } = boundGlobalActions;
  const { total } = option;
  const formConfigVo = activityInfo.get('form_config_vo')?.toJS();
  // 登记表单号，一个相册id只能登记一次
  const registerID = `${formConfigVo?.enc_broadcast_id}-register-form`;
  /**
   * 营销表单展示时机
   * CN
   * 有水印
   * 查看大图时
   * 且第一次
   */
  if (
    __isCN__ &&
    pageSetting?.watermark === LIVE_PHOTO_VERIFY_WATERMARK &&
    formConfigVo?.popup_type === 2 &&
    !auth.hasCode(registerID) &&
    formConfigVo?.enabled
  ) {
    boundGlobalActions.showModal(CUSTOM_FORM_MODAL, {
      onSuccess: () => {
        showModal(IMAGE_VIEWER_MODAL, {
          photoList: images,
          index: index,
          total,
          handleClose: () => {
            hideModal(IMAGE_VIEWER_MODAL);
          },
          loadData: that.loadData,
        });
      },
    });
    return;
  }
  showModal(IMAGE_VIEWER_MODAL, {
    photoList: images,
    index: index,
    total,
    handleClose: () => {
      hideModal(IMAGE_VIEWER_MODAL);
    },
    loadData: that.loadData,
  });
};

const showFilter = that => {
  that.setState({
    isShowFilterModal: true,
  });
};

// 加载Image数据
const loadData = that => {
  const { isLoadingImageList } = that.state;
  if (!isLoadingImageList) {
    return service.getContentList(that);
  }
  return false;
};

const loadTimeLineImageData = that => {
  const { isLoadingTimeLineImageList } = that.state;
  if (!isLoadingTimeLineImageList) {
    service.getContentListByTimeSegment(that);
  }
};

// 加载HotImage数据
const loadHotImageData = that => {
  const { isLoadingHotImageList } = that.state;
  if (!isLoadingHotImageList) {
    service.getHotContentList(that);
  }
};

// 时间线重新排序
const timeLineImageAsc = that => {
  const { timeSegmentGroup, currentSortAsc } = that.state;
  // 修复展开没数据的bug
  // const newTimeSegmentGroup = timeSegmentGroup.map(item => {
  //   item.isOpened = false;
  //   item.images = [];
  //   return item;
  // });
  if (timeSegmentGroup) {
    that.setState({
      timeSegmentGroup: timeSegmentGroup.reverse(),
    });
  }
};

//获取更多图片
const getMoreImageData = that => {
  service.getContentList(that, true);
  that.setState({
    currentSortTypeIndex: 1,
    currentSetId: 'broadcast',
  });
};

export default {
  didMount,
  reloadImages,
  showShareQRCode,
  showImageViewer,
  showFilter,
  loadData,
  loadHotImageData,
  timeLineImageAsc,
  getMoreImageData,
  loadTimeLineImageData,
};
