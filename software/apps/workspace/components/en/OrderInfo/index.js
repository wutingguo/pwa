import React, { Component } from 'react';
import { orderStatusMap } from '../../../constants/strings';
import XLink from '@resource/components/XLink';
import { navigateToWwwOrExternalBrowser } from '@resource/lib/utils/history';

import './index.scss';

let timer = null;

class OrderInfo extends Component {
  constructor(props) {
    super(props);

    const { data } = props;
    const { toPayLeftTime = 0 } = data;

    this.state = {
      leftSeconds: Number(toPayLeftTime)
    };
  }

  componentDidMount() {
    const { data } = this.props;
    const { toPayLeftTime } = data;
    if (toPayLeftTime) {
      this.setState({
        leftSeconds: Number(toPayLeftTime)
      });

      timer = setInterval(() => {
        let { leftSeconds } = this.state;
        if (!leftSeconds) {
          clearInterval(timer);
        } else {
          leftSeconds -= 1000;
          this.setState({
            leftSeconds
          });
        }
      }, 1000);
    }
  }

  onClickTrackPackage(trackingNumberUrl) {
    navigateToWwwOrExternalBrowser(trackingNumberUrl, true);
  }

  render() {
    const { data } = this.props;
    const {
      orderNumber,
      createDateTime,
      createDateTimeStr,
      paidTime,
      orderStatus,
      cancelDateTime,
      completeDateTime,
      showToPayButton,
      transactionId,
      refundTransactionId,
      trackingNumberUrl,
      toPayTime = 0
    } = data;
    const { leftSeconds } = this.state;
    const isCanceledOrder = orderStatus === orderStatusMap.CANCELLED;
    const isUnpaidOrder = orderStatus === orderStatusMap.UNPAID;
    const leftHours = Math.floor(toPayTime / 3600000);
    const leftMinutes = Math.ceil(toPayTime - leftHours * 3600000) / 60000;
    const timeFormat = 'mmm dd, yyyy oo:ii:ss TT';

    return (
      <div className="section order-info">
        <div className="section-title">{t('SUBMISSION_DETAILS')}</div>
        <div className="section-content">
          <ul className="order-des">
            <li className="li-center">
              <div className="label">{t('ORDER')}#：</div>
              <div className="value">{orderNumber}</div>
            </li>
            <li className="li-center">
              <div className="label">{t('PRDER_DATE')}:</div>
              <div className="value">{createDateTimeStr}</div>
            </li>
            <li className="li-center">
              <div className="label">{t('ORDER_STATUS')}:</div>
              <div className="value">{t(orderStatus)}</div>
              {orderStatus === 'IN_SHIPPING' ? (
                <XLink className="track-package" onClick={this.onClickTrackPackage.bind(this, trackingNumberUrl)}>
                  {t('TRACK_PACKAGE')}
                </XLink>
               ) : null}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default OrderInfo;
