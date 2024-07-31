import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import XPortfolio from '@resource/components/Portfolio/Container';
import XPureComponent from '@resource/components/XPureComponent';

import equals from '@resource/lib/utils/compare';
import { hasRoute } from '@resource/lib/utils/helper';

import ModalEntry from '@apps/gallery-client-mobile/components/ModalEntry';
import mapDispatch from '@apps/gallery-client-mobile/redux/selector/mapDispatch';
import mapState from '@apps/gallery-client-mobile/redux/selector/mapState';

import main from './handle/main';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!hasRoute(window.location.href)) return false;
    main.didMount(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!hasRoute(window.location.href)) return false;
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      main.willReceiveProps(this, nextProps);
    }
  }

  /**
   * 设置默认的路由跳转
   */
  getDefaultRedirect = () => {
    const { location, isShareExpired, isNoData, isLoadCollectionCompleted, urls } = this.props;

    if (isShareExpired || isNoData) {
      return <Redirect to="/expiry" />;
    }

    const { saasBaseUrl } = urls.toJS();
    // if (location.pathname === '/' && !hasRoute(window.location.href) && loading) {
    if (location.pathname === '/') {
      if (saasBaseUrl && !hasRoute(window.location.href)) {
        return (
          <div className="portfolio-container">
            {saasBaseUrl && <XPortfolio {...this.props}></XPortfolio>}
          </div>
        );
      }
      return;
    }

    return null;
  };

  render() {
    // 项目私有弹框
    const modalProps = {
      ...this.props,
    };

    return (
      <Fragment>
        {/* 设置默认的路由跳转 */}
        {this.getDefaultRedirect()}

        {/* 项目私有弹框. */}
        <ModalEntry {...modalProps} />
      </Fragment>
    );
  }
}

export default withRouter(App);
