import html2Canvas from 'html2canvas';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import React, { Component } from 'react';

import XPureComponent from '@resource/components/XPureComponent';

import { formatDate } from '@resource/lib/utils/dateFormat';

import { XModal } from '@common/components';

import { getImageUrl } from '@apps/live-photo-client/utils/helper';
import IconClose from '@apps/live/components/Icons/IconClose';

import './index.scss';

class ShareQRCodeModal extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      isShowTip: false,
      tipContent: '',
      isShowSuffix: false,
    };
  }

  onCloseBtn = () => {
    const { data } = this.props;
    const handleClose = data.get('handleClose');
    if (isFunction(handleClose)) {
      handleClose();
    }
  };

  componentDidMount() {
    this.htmlToCanvas();
  }

  htmlToCanvas() {
    const element = document.getElementById('htmlToCanvas');
    const canvasOption = {
      useCORS: true,
      scale: window.devicePixelRatio,
      width: element.offsetWidth,
      height: element.offsetHeight,
    };
    html2Canvas(element, canvasOption).then(canvas => {
      const imgUrl = canvas.toDataURL('image/jpeg');
      this.setState({
        imgUrl,
      });
    });
  }

  render() {
    const { imgUrl } = this.state;
    const { envUrls, broadcastActivity, banner } = this.props;
    const baseUrl = envUrls.get('saasBaseUrl');
    const locationUrl = window.location.href;
    const enc_image_uid = banner.get('banner_images');
    let imgUrls = [];
    if (enc_image_uid) {
      imgUrls = enc_image_uid.split(',').map(item => {
        return getImageUrl(baseUrl, item);
      });
    }
    const modalProps = {
      className: 'share-qrcode-modal-wrap',
      isHideIcon: true,
      escapeClose: false,
      backdropClassName: 'share-qrcode-backdrop',
    };
    return (
      <XModal {...modalProps} opened>
        <div id="htmlToCanvas" className="poster-wrap">
          <div className="qrcode-wrap">
            <QRCode
              value={locationUrl}
              size={240}
              imageSettings={{
                height: 50,
                width: 50,
                excavate: false,
              }}
            />
          </div>
          <div className="qrcode-text-wrap">{t('LPC_CODE_SCAN')}</div>
        </div>

        <div className="close" onClick={() => this.onCloseBtn()}>
          <IconClose fill="#bbb" style={{ width: 25 }} />
        </div>
      </XModal>
    );
  }
}

ShareQRCodeModal.propTypes = {
  data: PropTypes.object.isRequired,
};

ShareQRCodeModal.defaultProps = {};

export default ShareQRCodeModal;
