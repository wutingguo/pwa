import React, { Fragment } from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import XCollect from '@resource/components/pwa/collect/XCollect';

export default class Collect extends XPureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { baseUrl, saasBaseUrl, saasShareUrl } = this.props.urls.toJS();
    const { history, userInfo } = this.props;
    const hasUserId = Number(userInfo.get('id')) !== -1;

    const collectProps = {
      baseUrl,
      saasBaseUrl,
      history,
      saasShareUrl
    };
    return (
      <div
        style={{
          padding: '20px 0'
        }}
      >
        {hasUserId && <XCollect {...collectProps} userInfo={userInfo} />}
      </div>
    );
  }
}
