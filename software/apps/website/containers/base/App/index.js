import { isImmutable } from 'immutable';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import XPureComponent from '@resource/components/XPureComponent';

// import XAuthorizedRoute from '@resource/components/pwa/XAuthorizedRoute';
import renderRoutes from '@resource/lib/utils/routeHelper';

import { websiteRoleEnum } from '@resource/lib/constants/strings';

import ModalEntry from '@apps/website/components/ModalEntry';
import mapDispatch from '@apps/website/redux/selector/mapDispatch';
import mapState from '@apps/website/redux/selector/mapState';

import withMatch from './handle/withMatch';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  state = { data: [] };

  render() {
    // 项目私有弹框
    const modalProps = {
      ...this.props,
    };

    const { userInfo } = this.props;

    // const userWebsiteRoleName = 'designer';
    const userWebsiteRole =
      userInfo && isImmutable(userInfo) ? userInfo.get('userWebsiteRole') : websiteRoleEnum.user;

    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props,
      // AuthorizedRoute: WebsiteAuthRoute,
      userWebsiteRole,
    });

    return (
      <Fragment>
        {/* 渲染的主体区域. */}
        {routeHtml}

        {/* 项目私有弹框. */}
        <ModalEntry {...modalProps} />
      </Fragment>
    );
  }
}

export default withMatch(withRouter(App));
