import classNames from 'classnames';
import { fromJS } from 'immutable';
import { get, merge, template } from 'lodash';
import React from 'react';

import {
  IMAGE_VIEWER_MODAL,
  SHARE_QRCODE_MODAL,
} from '@apps/live-photo-client/constants/modalTypes';
import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';

import service from './service';

const didMount = that => {
  const { currentSetId, sets } = that.state;
  // 设置默认值
  if (!currentSetId && sets && sets.length > 0) {
    that.setState({
      currentSetId: sets[0].id,
    });
  }
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
const showImageViewer = (that, index, images, { autoUpdate } = {}) => {
  const { boundGlobalActions, urls } = that.props;
  const { showModal, hideModal } = boundGlobalActions;
  showModal(IMAGE_VIEWER_MODAL, {
    photoList: images,
    index: index,
    logClick: that.logClick,
    handleClose: () => {
      hideModal(IMAGE_VIEWER_MODAL);
    },
    autoUpdate,
    handleAutoUpdateImage: autoUpdate ? that.handleAutoUpdateImage : undefined,
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
    service.getContentList(that);
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

  if (timeSegmentGroup) {
    that.setState({
      timeSegmentGroup: timeSegmentGroup.reverse(),
    });
  }
};

export default {
  didMount,
  showShareQRCode,
  showImageViewer,
  showFilter,
  loadData,
  loadHotImageData,
  timeLineImageAsc,
};
