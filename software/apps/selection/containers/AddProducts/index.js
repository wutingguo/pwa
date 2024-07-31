import React, { Fragment } from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import XCollectAdd from '@resource/components/pwa/collect/XCollectAdd';

export default class AddProducts extends XPureComponent {
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
        <XCollectAdd {...collectProps} />
      </div>
    );
  }
}
