import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import XPureComponent from '@resource/components/XPureComponent';

import renderRoutes from '@resource/lib/utils/routeHelper';

import mapDispatch from '@src/redux/selector/mapDispatch';
import mapState from '@src/redux/selector/mapState';

import ModalEntry from '@src/components/ModalEntry';

import withMatch from './handle/withMatch';
import singleSpaNavbar from './single-spa/action';
import popstate from './single-spa/popstate';

import './index.scss';

// __isCN__
@connect(mapState, mapDispatch)
class App extends XPureComponent {
  onPopstate = event => {
    popstate.onPopstate(this, event);
  };

  componentDidMount() {
    singleSpaNavbar.updateNavbarItems(this);
    window.addEventListener('popstate', this.onPopstate);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.onPopstate);
  }

  render() {
    // 项目私有弹框
    const modalProps = {
      ...this.props,
    };

    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props,
      // AuthorizedRoute: XAuthorizedRoute
    });

    const { pathname, search } = this.props.history.location;
    if (pathname.indexOf('software/workspace') > -1) {
      const designerPath = pathname.replace('workspace', 'designer') + search;
      this.props.history.replace(designerPath);
    }

    return (
      <Fragment>
        {routeHtml}

        {/* 项目私有弹框. */}
        <ModalEntry {...modalProps} />
      </Fragment>
    );
  }
}

export default withMatch(withRouter(App));
