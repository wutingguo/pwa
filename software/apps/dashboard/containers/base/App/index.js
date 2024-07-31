import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import XPureComponent from '@resource/components/XPureComponent';
import renderRoutes from '@resource/lib/utils/routeHelper';
import withMatch from './handle/withMatch';
import mapState from '@apps/dashboard/redux/selector/mapState';
import mapDispatch from '@apps/dashboard/redux/selector/mapDispatch';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  state = { data: [] };

  render() {
    const modalProps = {
      ...this.props
    };

    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props
    });

    return (
      <Fragment>
        {/* 渲染的主体区域. */}
        {routeHtml}

        {/* 项目私有弹框. */}
        {/* <ModalEntry {...modalProps} /> */}
      </Fragment>
    );
  }
}

export default withMatch(withRouter(App));
