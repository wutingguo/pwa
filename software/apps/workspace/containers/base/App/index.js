import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Route, Redirect, HashRouter, BrowserRouter } from 'react-router-dom';
import XPureComponent from '@resource/components/XPureComponent';
import XLayout from '@src/components/XLayout';

import mapState from '../../../redux/selector/mapState';
import mapDispatch from '../../../redux/selector/mapDispatch';

const notRenderSiderbarRouterList = [
  '/software/designer/ds-order-form',
  '/software/designer/ds-order-confirm',
  '/software/designer/ds-billing-review',
  '/software/designer/download'
];

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  render() {
    const { routes } = this.props;
    const layoutProps = {
      isShowSiderbar: !notRenderSiderbarRouterList.includes(location.pathname),
      ...this.props
    };
    return (
      <BrowserRouter>
        <XLayout {...layoutProps}>
          {routes.map((m, i) => {
            const C = m.component;
            const renderProps = {
              ...this.props,
              landingPage: m.landingPage,
              currentRoute: m
            };

            return (
              <Route
                exact={m.exact}
                key={m.id}
                path={m.path}
                render={() => <C {...renderProps} />}
              />
            );
          })}
        </XLayout>
      </BrowserRouter>
    );
  }
}

export default withRouter(App);
