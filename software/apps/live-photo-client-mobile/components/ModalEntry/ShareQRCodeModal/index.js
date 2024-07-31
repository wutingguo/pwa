import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import React, { Component } from 'react';

import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import { formatDate } from '@resource/lib/utils/dateFormat';
import { fetchImage } from '@resource/lib/utils/image';

import { XModal } from '@common/components';

import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';
import { countDown } from '@apps/live-photo-client-mobile/utils/utils';

import './index.scss';

class ShareQRCodeModal extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      posterImgUrl: '',
      isLoading: true,
      isShowTip: true,
      time: 2,
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
    this.getImageUrl();
    const QRCodeImg = document.getElementById('qrcodeWrap');
    QRCodeImg.addEventListener('touchstart', this.touchStart);
  }

  touchStart = e => {
    let time = Date.now();
    const QRCodeImg = document.getElementById('qrcodeWrap');
    // 兼容rn长按保存图片事件
    if (!window.ReactNativeWebView) return;
    const { posterImgUrl } = this.state;
    e.preventDefault();
    function touchEnd() {
      if (Date.now() - time > 1000) {
        // console.log('touchStart========', posterImgUrl);
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'MSG_SAVE_IMG', payload: { base64Img: posterImgUrl } })
        );
      }
      QRCodeImg.removeEventListener('touchend', touchEnd);
      QRCodeImg.removeEventListener('touchstart', this.touchStart);
    }
    QRCodeImg.addEventListener('touchend', touchEnd);
  };

  afterCountDown = () => {
    this.setState({
      isShowTip: false,
    });
  };

  splitMixedString = str => {
    const result = [];
    let currentWord = '';
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (this.isEnglishChar(char)) {
        currentWord += char;
      } else {
        if (currentWord !== '') {
          result.push(currentWord);
          currentWord = '';
        }
        result.push(char);
      }
    }
    if (currentWord !== '') {
      result.push(currentWord);
    }
    return result;
  };

  // 判断字符是否为英文字母
  isEnglishChar = char => {
    return /[a-zA-Z]/.test(char);
  };

  /**
   *
   * @param {*} ctx
   * @param {*} text
   * @param {*} contentWidth
   * @param {*} lineNumber
   * @returns
   */

  transformContentToMutiLineText = (ctx, text, contentWidth, lineNumber) => {
    let textArray = this.splitMixedString(text);
    let temp = '';
    let row = [];
    for (let i = 0; i < textArray.length; i++) {
      if (ctx.measureText(temp).width < contentWidth && textArray[i] != '\n') {
        const newTemp = temp + textArray[i];
        if (ctx.measureText(newTemp).width > contentWidth) {
          row.push(temp);
          temp = textArray[i];
        } else {
          temp += textArray[i];
        }
      }
    }
    row.push(temp);

    if (row.length > lineNumber) {
      let rowCut = row.slice(0, lineNumber);
      let rowPart = rowCut[1];
      let test = '';
      let empty = [];
      for (let a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < contentWidth) {
          test += rowPart[a];
        } else {
          break;
        }
      }
      empty.push(test);
      let group = empty[0] + '...';
      rowCut.splice(lineNumber - 1, 1, group);
      row = rowCut;
    }
    return row;
  };

  // 渲染文字
  randerText = (ctx, text, contentWidth) => {
    // if (!__isCN__) {
    //   text = text
    //     .trim()
    //     .split(' ')
    //     .map(item => `${item} `);
    // }
    const row = [];
    let temp = '';

    for (let i = 0; i < text.length; i++) {
      if (ctx.measureText(temp + text[i]).width < contentWidth) {
        temp += text[i];
      } else {
        row.push(temp);
        temp = '';
        temp += text[i];
      }
    }
    row.push(temp);
    return row;
  };

  async getImageUrl() {
    const { time } = this.state;
    const { envUrls, banner, broadcastActivity, broadcastAlbum } = this.props;
    const title = broadcastAlbum.get('album_name');
    const date = formatDate(broadcastActivity.get('begin_time'), '.');
    const city = broadcastActivity.get('city');
    const firstIndex = city.indexOf('-');
    const newCity = city.slice(firstIndex + 1);
    const baseUrl = envUrls.get('saasBaseUrl');
    const banner_image_infos = banner.get('banner_image_infos');

    const PosterSize = { width: 646, height: 532 };
    const HeadImgSize = { width: 646, height: 300 };
    const QRImgSize = { width: 240, height: 240 };
    let headImg = '';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (banner_image_infos && banner_image_infos.size > 0) {
      const image = banner_image_infos.get(0).toJS();
      let { banner_image_id, height, width, orientation } = image;
      // 兼容旋转图片
      if (orientation === 5 || orientation === 6 || orientation === 7 || orientation === 8) {
        width ^= height;
        height ^= width;
        width ^= height;
      }
      let r = 1,
        h = height,
        w = HeadImgSize.width;
      r = w / width;
      h *= r;
      HeadImgSize.height = h;
      const imgUrl = getRotateImageUrl({
        baseUrl,
        enc_image_uid: banner_image_id,
        thumbnail_size: 1,
      });
      headImg = await fetchImage(imgUrl);
      PosterSize.height = PosterSize.height + HeadImgSize.height;
    } else {
      HeadImgSize.height = 0;
    }

    ctx.fillStyle = '#222222';
    ctx.font = '32px Gotham SSm A';
    // const titleRow = this.transformContentToMutiLineText(ctx, title, PosterSize.width - 64, 120);
    const titleRow = this.randerText(ctx, title, PosterSize.width - 64);
    PosterSize.height =
      titleRow.length >= 2 ? PosterSize.height + (titleRow.length - 1) * 42 : PosterSize.height;
    canvas.width = PosterSize.width;
    canvas.height = PosterSize.height;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (headImg) {
      const { sx, sy, sw, sh } = this.calcCoverData(
        headImg.width,
        headImg.height,
        HeadImgSize.width,
        HeadImgSize.height
      );
      ctx.drawImage(headImg, sx, sy, sw, sh, 0, 0, HeadImgSize.width, HeadImgSize.height); // 因为是cover覆盖， 所以dx,dy都是0，绘制宽高即为canvas宽高
    }

    let contentY = HeadImgSize.height + 32;
    for (let i = 0; i < titleRow.length; i++) {
      const element = titleRow[i];
      ctx.fillStyle = '#222222';
      ctx.font = '32px Gotham SSm A';
      ctx.fillText(element, 32, contentY, PosterSize.width - 64);
      contentY += 42;
    }
    ctx.font = '24px Gotham SSm A';
    ctx.fillStyle = '#7B7B7B';
    contentY += 20;
    ctx.fillText(date, 32, contentY, PosterSize.width - 64);
    contentY += 40;
    ctx.fillText(newCity, 32, contentY, PosterSize.width - 64);
    const QRCodeImg = document.getElementById('qrCode'); // 获取canvas类型的二维码
    contentY += 64;
    ctx.drawImage(
      QRCodeImg,
      (PosterSize.width - QRImgSize.width) / 2,
      headImg ? contentY : contentY,
      QRImgSize.width,
      QRImgSize.height
    );
    ctx.textAlign = 'center';
    ctx.fillText(t('LPCM_CODE_SCAN'), canvas.width / 2, canvas.height - 60);
    const data = canvas.toDataURL('image/jpeg', 1);
    this.setState(
      {
        posterImgUrl: data,
      },
      () => {
        countDown(time, '', this.afterCountDown);
      }
    );
  }

  calcCoverData(w, h, cw, ch) {
    let sx, sy, sw, sh, imgRatio, canvasRatio;
    canvasRatio = cw / ch;
    imgRatio = w / h;
    if (imgRatio <= canvasRatio) {
      sw = w;
      sh = sw / canvasRatio;
      sx = 0;
      sy = (h - sh) / 2;
    } else {
      sh = h;
      sw = sh * canvasRatio;
      sx = (w - sw) / 2;
      sy = 0;
    }
    return { sx, sy, sw, sh };
  }

  render() {
    const { posterImgUrl, isShowTip } = this.state;
    const locationUrl = window.location.href;
    const modalProps = {
      className: 'share-qrcode-modal-wrap',
      isHideIcon: true,
      escapeClose: false,
      closeByBackDropClick: true,
      onClosed: () => this.onCloseBtn(),
      backdropClassName: 'share-qrcode-backdrop',
    };
    return (
      <div className="share-qrcode-modal-container">
        <XLoading type="imageLoading" size="lg" zIndex={99} isShown={!posterImgUrl} />
        <XModal {...modalProps} opened>
          {posterImgUrl && (
            <div className="poster-container">
              {isShowTip && <div className="poster-text-warp">{t('LPCM_LONGPRESS_SAVE')}</div>}
              <div className="poster-wrap">
                <div className="img-wrap">
                  <img src={posterImgUrl} />
                </div>
              </div>
            </div>
          )}
          {posterImgUrl && <div className="close" onClick={() => this.onCloseBtn()} />}
          <div className="qrcode-wrap" id="qrcodeWrap">
            <QRCode
              id="qrCode"
              renderAs="canvas"
              value={locationUrl}
              size={240}
              imageSettings={{
                height: 50,
                width: 50,
                excavate: false,
              }}
            />
          </div>
        </XModal>
      </div>
    );
  }
}

ShareQRCodeModal.propTypes = {
  data: PropTypes.object.isRequired,
};

ShareQRCodeModal.defaultProps = {};

export default ShareQRCodeModal;
