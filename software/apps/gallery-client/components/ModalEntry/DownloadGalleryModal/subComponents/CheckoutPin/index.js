import React, { Component } from 'react';

import XButton from '@resource/components/XButton';

import XInput from '@resource/components/pwa/XInput';

import * as cache from '@resource/lib/utils/cache';

import { getPinCacheKey } from '@apps/gallery-client/utils/helper';

import './index.scss';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: '',
      isShowPinInvalidMsg: false,
    };
  }

  componentDidMount() {
    const { collection_uid } = this.props;
    const pinCacheKey = getPinCacheKey(collection_uid);
    const pin = cache.get(pinCacheKey) || '';
    this.setState({ pin });
  }

  handleNext = async () => {
    const {
      collection_uid,
      downloadType,
      set_id,
      onClosed,
      goToStep,
      boundProjectActions,
      boundGlobalActions,
      urls,
      downloadGallery,
      detail,
      downloadSetting,
      openChoolesImg,
      isHasExistedZip,
    } = this.props;
    window.logEvent.addPageEvent({
      name:
        downloadType === 1
          ? 'ClientGalleryDownloadPopup_Click_Next'
          : 'ClientGallerySingleDownloadPopup_Click_Next',
      collectionId: collection_uid,
    });
    const { pin } = this.state;

    const { addNotification } = boundGlobalActions;
    const { checkoutGalleryDownloadPin } = boundProjectActions;

    if (!pin) {
      this.setState({
        isShowPinInvalidMsg: true,
      });
      return false;
    }

    const { unSupportDownload, is_pin_valid } = await checkoutGalleryDownloadPin({
      pin,
      download_type: downloadType,
      set_uid: set_id,
    });

    if (unSupportDownload) {
      addNotification({
        message:
          downloadType === 1
            ? t('UNSUPPORT_DOWNLOAD_COLLECTION')
            : t('UNSUPPORT_DOWNLOAD_SINGLE_PHOTO'),
        level: 'error',
        autoDismiss: 2,
      });
      onClosed();
    }

    if (!is_pin_valid) {
      this.setState({ isShowPinInvalidMsg: true });
      return false;
    }

    const pinCacheKey = getPinCacheKey(collection_uid);
    cache.set(pinCacheKey, pin);
    const { download_limited } = downloadSetting || {};

    if (downloadType === 1 && !__isCN__ && download_limited) {
      onClosed();
      openChoolesImg();
      return false;
    }
    if (isHasExistedZip) {
      goToStep(2);
      return;
    }
    goToStep(3);
  };

  handleCancel = () => {
    const { onClosed, collection_uid, downloadType } = this.props;
    window.logEvent.addPageEvent({
      name:
        downloadType === 1
          ? 'ClientGalleryDownloadPopup_Click_Cancel'
          : 'ClientGallerySingleDownloadPopup_Click_Cancel',
      collectionId: collection_uid,
    });
    onClosed();
  };

  handleChange = e => {
    const pin = e.target.value;
    this.setState({ pin, isShowPinInvalidMsg: !pin });
  };

  render() {
    const { pin, isShowPinInvalidMsg, isDownloadSinglePhoto } = this.state;

    const inputProps = {
      value: pin,
      maxLength: 4,
      placeholder: __isCN__ ? '请输入下载密码' : 'Enter download PIN',
      isShowTip: isShowPinInvalidMsg,
      tipContent: !pin ? t('PIN_REQUIRED') : t('PIN_INCORRECT'),
      onChange: this.handleChange,
    };

    return (
      <div className="checkout-pin-container">
        <span className="checkout-pin-title">{t('DOWNLOAD_PHOTOS')}</span>
        <span className="checkout-pin-desc">
          {isDownloadSinglePhoto
            ? t('CHECKOUT_PIN_SINGLE_PHOTO_DESC')
            : t('CHECKOUT_PIN_COLLECTION_DESC')}
        </span>
        <div className="checkout-pin-input-wrapper">
          <XInput {...inputProps} />
        </div>
        <div className="checkout-pin-btn-wrapper">
          <XButton className="white checkout-pin-btn" onClicked={this.handleCancel}>
            {t('CANCEL')}
          </XButton>
          <XButton className="black checkout-pin-btn" onClicked={this.handleNext}>
            {__isCN__ ? '下一步' : t('NEXT')}
          </XButton>
        </div>
      </div>
    );
  }
}
