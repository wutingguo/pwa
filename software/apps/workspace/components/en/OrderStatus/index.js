import React, { Component } from 'react';
import { processStatusClass } from '../../../constants/strings';
import './index.scss';

class OrderStatus extends Component {
  constructor(props) {
    super(props);

    this.getRenderSteps = this.getRenderSteps.bind(this);
    this.getIconRenderSteps = this.getIconRenderSteps.bind(this);
  }

  getIconRenderSteps() {
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
      const className = processStatusClass[keyStatus];
      const style = {
        background: './check.png'
      };
      if (index > 0) {
        html.push(
          <div className={`line ${className}`} >
            <div className={`status-line ${className}`}></div>
          </div>
        );
      }

      html.push(
        <div className={`icon`} style={style} key={index}>
          <div className={`status-icon ${className}`}></div>
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
        const { logTime, logTimeStr, logInfo } = item;
        html.push(
          <div className="log-item" key={`log-${index}`}>
            <div className="time">{logTimeStr}</div>
            <div className="msg">{logInfo}</div>
          </div>
        );
      });
    }

    return html;
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
        processStatusTime,
        processStatusDayStr,
        processStatusTimeStr
      } = item;
      const className = processStatusClass[keyStatus];

      html.push(
        <div className={`status ${className}`} key={index}>
          <div className="status-text">{keyText}</div>
          {processStatusTime && !extraKeyText ? (
            <div className="update-time">
              {processStatusDayStr}
              <br />
              {processStatusTimeStr}
            </div>
          ) : null}
          {extraKeyText ? <div className="partial">{extraKeyText}</div> : null}
        </div>
      );
    });
    return html;
  }

  render() {
    return (
      <div className="section order-status">
        <div className="section-title">{t('TRACKING_DETAILS')}</div>
        <div className="section-content">
          <div className="iconSteps">{this.getIconRenderSteps()}</div>
          <div className="steps">{this.getRenderSteps()}</div>
          <div className="logs">{this.getRenderLogs()}</div>
        </div>
      </div>
    );
  }
}

export default OrderStatus;
