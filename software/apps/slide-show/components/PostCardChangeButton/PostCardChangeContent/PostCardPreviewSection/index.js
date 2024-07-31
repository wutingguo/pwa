import React from 'react';
import { XPureComponent } from '@common/components';
import { getSlideShowImageUrl } from '@resource/lib/saas/image';
import weixinIcon from './icons/wexin@2x.png';
import weiboIcon from './icons/webo@2x.png';
import './index.scss';

class PostCardPreviewSection extends XPureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      card_name,
      is_default,
      studio_name,
      weibo_account,
      studio_address,
      galleryBaseUrl,
      official_qr_code,
      weichat_account,
      official_website,
      official_logo_image,
      studio_introduction
    } = this.props;

    const logoImgUrl = getSlideShowImageUrl({
      galleryBaseUrl,
      enc_image_uid: official_logo_image,
      isWaterMark: false
    });
    const qrCodeImgUrl = getSlideShowImageUrl({
      galleryBaseUrl,
      enc_image_uid: official_qr_code,
      isWaterMark: false
    });
    const logoContentStyle = {
      background: `url(${logoImgUrl}) no-repeat center center`
    };

    let newStudioAddress = studio_address;
    if(newStudioAddress.indexOf('|') > 0) {
      const arr = newStudioAddress.split('|');
      arr.shift();
      newStudioAddress = arr.join('|');
    }

    return (
      <div className="post-card-preview-section">
        <div className="post-card-preview-wrapper">
          <div className="preview-card-content">
            <div className="card-header">
              <div className="logo-content" style={logoContentStyle}>
                <img src={logoImgUrl} />
              </div>
              <div className="card-detail">
                <div className="card-name">{studio_name}</div>
                <div className="card-address">{newStudioAddress}</div>
              </div>
            </div>

            <div className="card-introduction">
              <p className="label">工作室简介：</p>
              <p
                className="introduction-content"
                dangerouslySetInnerHTML={{
                  __html: String(studio_introduction).replace(
                    /https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+)/,
                    function(s1) {
                      return `<a href="${s1}" target="_blank">${s1}</a>`;
                    }
                  )
                }}
              ></p>
            </div>

            <div className="contact">
              <div className="left">
                <div className="label">联系我们: </div>
                <div className="weixin-account">
                  <img className="account-icon" src={weixinIcon} />
                  <span>{weichat_account}</span>
                </div>
                <div className="weibo-account">
                  <img className="account-icon" src={weiboIcon} />
                  <span>{weibo_account}</span>
                </div>
              </div>
              <div className="right">
                <img src={qrCodeImgUrl} className="qr-code" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PostCardPreviewSection;
