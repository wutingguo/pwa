import React, { Component } from 'react';
import { ORDER_PROCESS_STTAUS_IMG_PREFIX } from '../../constants/apiUrl';
import { CDN_PREFIX, processStatusClass } from '../../constants/strings';
import { formatTime } from '../../utils/date';
import './index.scss';

class OrderStatus extends Component {
  constructor(props) {
    super(props);

    this.getRenderSteps = this.getRenderSteps.bind(this);
    this.getRenderLogs = this.getRenderLogs.bind(this);
  }

  getRenderSteps() {
    const { data } = this.props;
    const { processStatusDataList = [] } = data;

    const html = [];

    processStatusDataList.forEach((item, index) => {
      const {
        key,
        keyText,
        extraKeyText,
        keyStatus,
        processStatusTime
      } = item;
      const src = `${ORDER_PROCESS_STTAUS_IMG_PREFIX}${key}.png`;
      const imgSrc = `${CDN_PREFIX}${src}`;
      const className = processStatusClass[keyStatus];
      const style = {
        background: `url(${imgSrc}) center center no-repeat`
      };
      html.push(
        <div className={`status ${className}`} style={style} key={index}>
          <div className="status-text">{keyText}</div>
          {processStatusTime && !extraKeyText ? (
            <div className="update-time">
              {formatTime(processStatusTime)}
              <br />
              {formatTime(processStatusTime, 'hh:ii:ss')}
            </div>
          ) : null}
          {extraKeyText ? <div className="partial">{extraKeyText}</div> : null}
        </div>
      );
    });

    return html;
  }

  getRenderLogs() {
    const { data } = this.props;
    const { processLogList } = data;
    const html = [];

    if (processLogList && processLogList.length) {
      processLogList.forEach((item, index) => {
        const { logTime, logInfo } = item;
        html.push(
          <div className="log-item" key={`log-${index}`}>
            <div className="time">{formatTime(logTime, 'yyyy-mm-dd hh:ii:ss')}</div>
            <div className="msg">{logInfo}</div>
          </div>
        );
      });
    }

    return html;
  }

  render() {
    const { data } = this.props;
    const { orderStatus, shippingStatus, processLogList } = data;
    return (
      <div className="section order-status">
        <div className="section-title">订单状态追踪</div>
        <div className="section-content">
          <div className="steps">{this.getRenderSteps()}</div>
          <div className="logs">{this.getRenderLogs()}</div>
        </div>
      </div>
    );
  }
}

export default OrderStatus;
