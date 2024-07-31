import classNames from 'classnames';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import XPortfolio from '@resource/components/Portfolio/Container';
import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import { hasRoute } from '@resource/lib/utils/helper';

import mapDispatch from '@apps/gallery-client-mobile/redux/selector/mapDispatch';
import mapState from '@apps/gallery-client-mobile/redux/selector/mapState';

import EmailEnter from './EmailEnter';
import EmailEnterCN from './EmailEnterCN';
import Home from './Home';

import './index.scss';

@connect(mapState, mapDispatch)
class Index extends XPureComponent {
  render() {
    if (location.pathname === '/') {
      return null;
    }
    const { isLoadCollectionCompleted, isRequiredEmailBeforeViewing, urls } = this.props;

    const { saasBaseUrl } = urls.toJS();
    if (saasBaseUrl && !hasRoute(window.location.href)) {
      return (
        <div className="portfolio-container">
          {saasBaseUrl && <XPortfolio {...this.props}></XPortfolio>}
        </div>
      );
    }

    if (!isLoadCollectionCompleted && hasRoute(window.location.href)) {
      return (
        <XLoading type="imageLoading" size="lg" zIndex={99} isShown={!isLoadCollectionCompleted} />
      );
    }
    const LoginEnter = __isCN__ ? EmailEnterCN : EmailEnter;
    return (
      <div className="main-container">
        {isRequiredEmailBeforeViewing ? <LoginEnter {...this.props} /> : <Home {...this.props} />}
      </div>
    );
  }
}

export default Index;
