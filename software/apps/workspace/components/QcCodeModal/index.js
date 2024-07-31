import React, { Component } from 'react';
import getQRCodeUrl from '@resource/lib/service/getQrcode';
import XModal from '../XModal/index';
import './index.scss';
import codeImg from './image/code.jpg';
import welImg from './image/wel.jpg';
export default class QcCodeModal extends Component {
  state = {
    fuliQrcode: ''
  };

  componentDidMount() {
    const scene = 'customerService';
    getQRCodeUrl('', scene).then(fuliQrcode => {
      this.setState({
        fuliQrcode
      });
    });
  }

  render() {
    const { handleClose, popoutClass } = this.props;
    const { fuliQrcode } = this.state;
    const xmodalProps = {
      data: {
        title: '',
        className: 'qc-modal ' + popoutClass,
        backdropColor: 'rgba(17, 17, 17, 0.4)',
        isHideIcon: false
      },
      actions: {
        handleClose
      }
    };

    return (
      <XModal {...xmodalProps}>
        <div className="q-title">福利领取</div>
        <div className="q-sub">
          尊敬的客户，欢迎使用寸心云服，即刻领取您的专属<span className="weal">福利！</span>
        </div>
        <div className="q-code">
          <div className="title">扫下方二维码领取</div>
          <img src={fuliQrcode} />
          <div className="sub">微信扫一扫</div>
        </div>
        <div className="q-welfare">
          <img src="/clientassets-cunxin-saas/portal/images/wap/coupon/1v1-50.jpg" />
        </div>
      </XModal>
    );
  }
}
