import React, { Component } from 'react';

import { XButton, XModal } from '@common/components';

import closeIcon from '../../../icons/close.png';

import './index.scss';

export default class LookPriceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  close = () => {
    this.props.onClose();
  };
  render() {
    const { data, project_name } = this.props;
    const { main_base_price, option_base_price, total_base_price } = data || {};
    return (
      <XModal
        className="look-price-modal"
        opened
        onClosed={this.close}
        escapeClose={false}
        isHideIcon={false}
      >
        <div className="look-price-modal-wrap">
          <div className="price-item">
            编辑作品：<span>{project_name}</span>
          </div>
          <div className="price-item">
            产品价格：<span>￥{Number(main_base_price || 0).toFixed(2)}</span>
          </div>
          <div className="price-item">
            工艺费：<span>￥{Number(option_base_price || 0).toFixed(2)}</span>
          </div>
          <div className="price-item">
            合计价格：<span>￥{Number(total_base_price || 0).toFixed(2)}</span>
          </div>
        </div>
        <div className="look-confirm-button" onClick={this.close}>
          确定
        </div>
      </XModal>
    );
  }
}
