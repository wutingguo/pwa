import classNames from 'classnames';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import React, { Component } from 'react';
import { select } from 'react-cookies';

import { NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';

import { getMiniProgramQrcode } from '@resource/lib/service/getQrcode';

import { XButton, XIcon, XInput, XModal, XPureComponent } from '@common/components';

import './index.scss';

class GetDirectLinkModal extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hasCopied: false,
      tab: 'getLink',
      collectionsSettingsProps: {},
      checkPin: false,
      checkPassword: true,
      wxQrcodeValue: '',
    };
  }

  componentDidMount() {
    const { data } = this.props;
    const collectionsSettings = data.get('collectionsSettings');
    if (collectionsSettings.size > 0) {
      this.setState({
        collectionsSettingsProps: collectionsSettings.toJS(),
      });
      const codeParams = {
        appId: 'wx361e424837dadfa6',
        path: 'pages/galleryClientHome/index',
        scene: collectionsSettings.toJS().enc_collection_uid,
        width: 120,
      };
      getMiniProgramQrcode(codeParams).then(res => {
        const url = URL.createObjectURL(res);
        this.setState({
          wxQrcodeValue: url,
        });
      });
    } else {
      const getCollectionsSettings = data.get('getCollectionsSettings');
      getCollectionsSettings().then(res => {
        const { ret_code, data } = res;
        if (ret_code === 200000) {
          this.setState({
            collectionsSettingsProps: data,
          });
          const codeParams = {
            appId: 'wx361e424837dadfa6',
            path: 'pages/galleryClientHome/index',
            scene: `${data.enc_collection_uid}`,
            width: 120,
          };
          getMiniProgramQrcode(codeParams).then(res => {
            const url = URL.createObjectURL(res);
            this.setState({
              wxQrcodeValue: url,
            });
          });
        }
      });
    }
  }

  onCopyDirectLink = () => {
    const { data } = this.props;
    const { checkPin, checkPassword, collectionsSettingsProps } = this.state;
    const collectionSetting = collectionsSettingsProps.collection_setting || {};
    const { gallery_password_switch, gallery_password } = collectionSetting;
    const pinSetting = data.get('pinSetting');
    const pin = pinSetting.get('pin');
    const pinStatus = pinSetting.get('common_pin_status');
    const obj = document.querySelector('#getDirectLinkInput');

    const pinText = pin && pinStatus && checkPin ? `${t('DOWNLOAD_PIN')}: ${pin}` : '';
    const passwordText =
      gallery_password_switch && gallery_password && checkPassword
        ? `${t('GALLERY_CLIENT_PASSWORD')}: ${gallery_password}`
        : '';

    obj.select();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${obj.value} ${passwordText}  ${pinText}`);
    } else {
      document.execCommand('Copy');
    }

    this.setState({
      hasCopied: true,
    });
  };

  changeTab = key => {
    this.setState({
      tab: key,
    });
  };

  downloadQrcode = () => {
    const img = new Image();
    const canvasImg = document.getElementById('qrCode'); // 获取canvas类型的二维码
    const downLink = document.getElementById('down_link');
    img.src = canvasImg && canvasImg.toDataURL('image/png'); // 将canvas对象转换为图片的data url
    downLink.href = img.src;
    downLink.download = '选片分享二维码';
  };
  downloadWxQrcode = () => {
    const img = new Image();
    const canvasImg = document.getElementById('wximg');
    const downLink = document.getElementById('wx_down_link');
    img.src = canvasImg.src;
    downLink.href = img.src;
    downLink.download = '选片二维码.png';
  };

  checkClick = e => {
    const { value, checked } = e.target;
    this.setState({
      [value]: checked,
    });
  };

  render() {
    const { data } = this.props;
    const { hasCopied, tab, collectionsSettingsProps, checkPassword, checkPin, wxQrcodeValue } =
      this.state;

    const close = data.get('close');
    const title = data.get('title');
    const topic = data.get('topic');
    const tip = data.get('tip');
    const inputValue = data.get('shareDirectLink');
    const wrapClass = classNames('x-get-direct-link-wrap', data.get('className'));
    const pinSetting = data.get('pinSetting');
    const pin = pinSetting.get('pin');
    const pinStatus = pinSetting.get('common_pin_status');
    const sty = data.get('style');
    const style = sty ? sty.toJS() : {};

    const collectionSetting = collectionsSettingsProps.collection_setting || {};
    const { gallery_password_switch, gallery_password } = collectionSetting;
    const isPassword = (pin && pinStatus) || (gallery_password && gallery_password_switch);
    const copyBtnText =
      (checkPin && pinStatus) || (gallery_password_switch && checkPassword)
        ? t('CLONE_HREF_PASSWORD')
        : t('CLONE_HREF');
    const escapeClose = !!data.get('escapeClose');
    const isHideIcon = !!data.get('isHideIcon');
    const inputProps = {
      className: 'get-direct-link-input',
      value: inputValue,
      hasSuffix: false,
      isShowSuffix: false,
      readOnly: 'readonly',
      id: 'getDirectLinkInput',
      onClick: this.onCopyDirectLink,
    };

    const linkIconCls = classNames({
      'cn-link-icon': __isCN__,
    });

    const switchTab = [
      {
        title: '获取链接',
        key: 'getLink',
      },
      {
        title: '网页二维码',
        key: 'qrcode',
      },
      {
        title: '小程序码',
        key: 'wxQrcode',
      },
    ];

    return (
      <XModal
        className={wrapClass}
        styles={style}
        opened={true}
        onClosed={close}
        escapeClose={escapeClose}
        isHideIcon={isHideIcon}
      >
        {/* <div className="modal-title">{title}</div> */}
        <div className="modal-switch-title">
          {switchTab.map(item => (
            <span
              key={item.key}
              className={`switchItem ${tab === item.key ? 'cur' : ''}`}
              onClick={() => this.changeTab(item.key)}
            >
              {item.title}
            </span>
          ))}
        </div>
        <div className="modal-body">
          {tab === 'getLink' && (
            <div className="copy-link-wrap">
              {/* <span className="topic">{topic}</span> */}
              <div className="input-with-copy">
                <span className="forward-icon">
                  <XIcon className={linkIconCls} type="link" iconWidth={16} iconHeight={16} />
                </span>
                <XInput {...inputProps} />
                {/* <span className="copy-btn" onClick={this.onCopyDirectLink}>
                  {hasCopied ? copiedBtnText : copyBtnText}
                </span> */}
              </div>
              <span className="tips">{tip}</span>
              {isPassword && (
                <div className="pass-check">
                  <div className="title">{t('COPY_URL_COPY_PASSWORD')}</div>
                  <div className="check-content">
                    {gallery_password_switch && (
                      <label>
                        <input
                          type="checkbox"
                          checked={checkPassword}
                          value="checkPassword"
                          onClick={this.checkClick}
                        ></input>
                        {t('GALLERY_CLIENT_PASSWORD')}: <span>{gallery_password}</span>
                      </label>
                    )}
                    {pinStatus && (
                      <label>
                        <input
                          type="checkbox"
                          checked={checkPin}
                          value="checkPin"
                          onClick={e => this.checkClick(e)}
                        ></input>
                        {t('DOWNLOAD_PIN')}: <span>{pin}</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
              <XButton className="copy-btn" onClicked={this.onCopyDirectLink}>
                {copyBtnText}
              </XButton>
            </div>
          )}
          {tab === 'qrcode' && (
            <div className="znoUrl-wrap">
              <div className="qr-tip">扫码分享给客户</div>
              <div className="position-qrcode">
                <div className="qr-wrap">
                  <QRCode value={inputValue} id="qrCode" size={120}></QRCode>
                </div>
              </div>
              <a className="download" id="down_link" onClick={this.downloadQrcode}>
                保存到本地
              </a>
            </div>
          )}
          {tab === 'wxQrcode' && (
            <div className="znoUrl-wrap">
              <div className="qr-tip">扫描小程序码</div>
              <div className="position-qrcode">
                <div className="qr-wrap">
                  <img id="wximg" src={wxQrcodeValue} />
                </div>
              </div>
              <a className="download" id="wx_down_link" onClick={this.downloadWxQrcode}>
                保存到本地
              </a>
            </div>
          )}
        </div>
      </XModal>
    );
  }
}

GetDirectLinkModal.propTypes = {
  data: PropTypes.object.isRequired,
};

GetDirectLinkModal.defaultProps = {};

export default GetDirectLinkModal;
