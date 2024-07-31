import { isImmutable } from 'immutable';
import React from 'react';

import XPureComponent from '@resource/components/XPureComponent';

import WebsitePresets from '@apps/website/components/WebsitePresets';

import './index.scss';

class WebsiteDesigner extends XPureComponent {
  constructor(props) {
    super(props);
  }
  state = {};

  componentDidMount() {
    const { boundGlobalActions } = this.props;
  }
  componentWillReceiveProps() {}

  render() {
    const { boundGlobalActions, boundProjectActions, urls, userInfo } = this.props;
    const {} = this.state;

    const role = userInfo && isImmutable(userInfo) ? userInfo.get('userWebsiteRole') : '';

    return (
      <div className="website-designer-page-container">
        <WebsitePresets
          role={role}
          baseUrl={urls.get('galleryBaseUrl')}
          boundGlobalActions={boundGlobalActions}
          boundProjectActions={boundProjectActions}
        />
      </div>
    );
  }
}

export default WebsiteDesigner;
