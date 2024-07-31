import { get, assign } from 'lodash';
import {
  NEW_COLLECTION_MODAL,
  EDIT_MODAL,
  SHARE_SLIDESHOW_MODAL
} from '@apps/slide-show/constants/modalTypes';
import { designerTutorialVideos } from '@apps/workspace/constants/strings';
import {
  VIDEO_MODAL_STATUS,
  SHOW_TABLE_PRICE_MODAL,
  PACKAGE_LIST_BOX_MODAL
} from '@resource/lib/constants/modalTypes';
import { saasProducts } from '@resource/lib/constants/strings';
import { fromJS } from 'immutable';

// 打开 galerry 价格表
const openTablePriceModal = (that, data) => {
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;
  const { priceData, tableTitle = '', product_id = '' } = data;
  showModal(PACKAGE_LIST_BOX_MODAL, {
    className: 'gallery-tutorial-wrapper',
    priceData,
    tableTitle,
    product_id
  });
};

const openTutorialVideo = (that, type) => {
  window.logEvent.addPageEvent({
    name: `Designer_Click_Tutorial0${type}`
  });
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;

  showModal(VIDEO_MODAL_STATUS, {
    className: 'gallery-tutorial-wrapper',
    groupVideos: designerTutorialVideos
  });
};

export default {
  openTablePriceModal,
  openTutorialVideo
};
