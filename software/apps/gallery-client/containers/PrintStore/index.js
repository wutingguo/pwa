import React, { memo, useCallback, useEffect } from 'react';
import { Redirect, useHistory, useLocation, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import QS from 'qs';
import mapState from '@apps/gallery-client/redux/selector/mapState';
import mapDispatch from '@apps/gallery-client/redux/selector/mapDispatch';
import Header from '../components/Header';
import { printStoreRoute } from '../../config/routes';
import useLogin from '../../hooks/useLogin';
import './index.scss';

// @connect(mapState, mapDispatch)
const PrintStore = props => {
  const { boundGlobalActions, boundProjectActions, store, urls } = props;
  const history = useHistory();

  const { restore } = useLogin({ boundGlobalActions, boundProjectActions });
  const currentSearchParams = QS.parse(location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (location.hash.indexOf('printstore/orders') !== -1) {
      return;
    }
    urls?.size && restore();
  }, [urls?.size, restore]);

  const user = store.get('user');
  const userIsFetched = store.getIn(['fetched', 'user']);
  // url参数里没有包含storeId
  const isStoreIdNotInQs = typeof currentSearchParams.storeId === 'undefined';

  return (
    <div className="print-store-page">
      {/*FIXME: 临时  路由需要整理 先做页面*/}
      <Switch>
        {printStoreRoute.routes.map(r => {
          const { component: Component, options = {}, pageName, exact, path } = r;
          const { noHeader = false, needLogin = false } = options;

          const rootPath = printStoreRoute.path;
          // 该页面需要登录时 且redux中没有用户信息 且url中存在storeId时（对应redux中更新storeId的动作，防止在更新storeId前重定向url） 在访问此url时重定向到首页
          if (needLogin && !isStoreIdNotInQs && userIsFetched && !user) {
            return <Redirect exact from={`${rootPath}${path}`} to={printStoreRoute.redirectTo} />;
          }

          return (
            <Route key={pageName} exact={exact} path={`${rootPath}${path}`}>
              {!noHeader && (
                <Header
                  className="print-store-page__header"
                  boundGlobalActions={boundGlobalActions}
                  boundProjectActions={boundProjectActions}
                  store={store}
                />
              )}
              <div className={`print-store-page__content ${noHeader ? 'fullHeight' : ''}`}>
                <Component {...{ ...props, history }} />
              </div>
            </Route>
          );
        })}
        {/*  '/printStore' 重定向到  '/printStore/categories' */}
        <Redirect exact path={printStoreRoute.path} to={printStoreRoute.redirectTo} />
      </Switch>
    </div>
  );
};

const ConnectApp = connect(mapState, mapDispatch)(withRouter(memo(PrintStore)));

export default ConnectApp;
