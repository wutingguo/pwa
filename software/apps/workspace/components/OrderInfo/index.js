import React, { Component } from 'react';
import { formatTime, formatGapTime } from '../../utils/date';
import { orderStatusText, orderStatusMap } from '../../constants/strings';
import { navigateToWwwOrSoftware } from '@resource/lib/utils/history';
import { relativeUrl } from '@resource/lib/utils/language';
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
    this.toBillingReview = this.toBillingReview.bind(this);
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

  toBillingReview(orderNumber) {
    const { history } = this.props;
    history.push(`/software/billing-review?oID=${orderNumber}`)
  }

  render() {
    const { data } = this.props;
    const {
      orderNumber,
      createDateTime,
      paidTime,
      orderStatus,
      cancelDateTime,
      completeDateTime,
      showToPayButton,
      transactionId,
      refundTransactionId,
      toPayTime = 0
    } = data;
    const { leftSeconds } = this.state;
    const isCanceledOrder = orderStatus === orderStatusMap.CANCELLED;
    const isUnpaidOrder = orderStatus === orderStatusMap.UNPAID;
    const leftHours = Math.floor(toPayTime / 3600000);
    const leftMinutes = Math.ceil(toPayTime - leftHours * 3600000) / 60000;
    const timeFormat = 'yyyy-mm-dd hh:ii:ss';
    return (
      <div className="section order-info">
        <div className="section-title">下单详情</div>
        <div className="section-content">
          <ul className="order-des">
            <li>
              <div className="label">订单编号：</div>
              <div className="value">{orderNumber}</div>
            </li>
            <li>
              <div className="label">下单时间:</div>
              <div className="value">{formatTime(createDateTime, timeFormat)}</div>
            </li>
            <li>
              <div className="label">订单状态:</div>
              <div className="value">{orderStatusText[orderStatus]}</div>
            </li>
            {isUnpaidOrder ? (
              <li>
                <div className="label">&nbsp;</div>
                <div className="value">
                  <p>
                    <div
                      className="pay"
                      onClick={() => this.toBillingReview(orderNumber)}
                    >
                      去支付
                    </div>
                  </p>
                  <p>
                    请在{' '}
                    <span>
                      {leftHours ? `${leftHours} 小时` : ''}
                      {leftMinutes ? `${leftMinutes} 分钟` : ''}{' '}
                    </span>
                    内完成付款，否则订单将会被系统取消.
                    <span className="left-time">{`剩余支付时间: ${formatGapTime(
                      leftSeconds,
                      'hh时 : ii分 : ss秒'
                    )}`}</span>
                  </p>
                </div>
              </li>
            ) : null}
            {!isCanceledOrder ? (
              <li>
                <div className="label">交易号：</div>
                <div className="value">{transactionId}</div>
              </li>
            ) : null}
            {/* 退款交易号 */}
            {refundTransactionId ? (
              <li>
                <div className="label">退款交易号：</div>
                <div className="value">{refundTransactionId}</div>
              </li>
            ) : null}
            {/* 付款时间 */}
            {paidTime && !isCanceledOrder ? (
              <li>
                <div className="label">付款时间：</div>
                <div className="value">{formatTime(paidTime, timeFormat)}</div>
              </li>
            ) : null}
            {/* 完成时间 */}
            {completeDateTime ? (
              <li>
                <div className="label">完成时间：</div>
                <div className="value">
                  {formatTime(completeDateTime, timeFormat)}
                </div>
              </li>
            ) : null}
            {/* 取消时间 */}
            {isCanceledOrder ? (
              <li>
                <div className="label">取消时间：</div>
                <div className="value">
                  {formatTime(cancelDateTime, timeFormat)}
                </div>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    );
  }
}

export default OrderInfo;
