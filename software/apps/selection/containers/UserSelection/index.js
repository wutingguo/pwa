import React, { Fragment } from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import XUserSelection from '@resource/components/pwa/collect/XUser-selection';

export default class UserSelection extends XPureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { baseUrl, saasBaseUrl } = this.props.urls.toJS();
    const { history } = this.props;
    const collectProps = {
      baseUrl,
      saasBaseUrl,
      history
    }
    return (
      <div style={{
        padding: '20px 0'
      }}>
        <XUserSelection {...collectProps} />
      </div>
    );
  }
}
