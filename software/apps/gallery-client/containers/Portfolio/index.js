import classNames from 'classnames';
import React, { Fragment } from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import XPortfolio from '@resource/components/Portfolio/Container';

class Index extends XPureComponent {
  render() {
    const { urls, userInfo, userAuth } = this.props
    const { saasBaseUrl } = urls.toJS()

    return (
        <div className="portfolio-container">
          {saasBaseUrl && <XPortfolio {...this.props}></XPortfolio>}
        </div>
    );
  }
}

export default Index;
