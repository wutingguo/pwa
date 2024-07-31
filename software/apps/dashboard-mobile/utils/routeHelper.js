import React, { Fragment } from 'react';
import { BrowserRouter, HashRouter, Redirect, Route } from 'react-router-dom';

import { filterByRole } from '@resource/pwa/utils';

/**
 * 设置默认的路由跳转
 */
// const getDefaultRedirect = ({ routes, location }) => {
//   if (routes && routes.map) {
//     const firstRoute = routes[0];
//     if (location.pathname === firstRoute.rootPath) {
//       // 去除url的参数,比如:id
//       return <Redirect to={firstRoute.path.replace(/(:\w+)/, () => '')} />;
//     }
//     if (location.pathname === '/software/' && firstRoute.rootPath === '/software') {
//       return <Redirect to="/software/designer/projects" />;
//     }
//     //原来的saas主页跳转
//     if (location.pathname === '/software/projects') {
//       return <Redirect to="/software/designer/projects" />;
//     }
//   }

//   return null;
// };

/**
 * 添加页面路由
 */
const renderRoutes = ({ props, AuthorizedRoute, isHash = true, userWebsiteRole = '' }) => {
  const { routes, location } = props;
  const routeHtml = routes ? (
    <Fragment>
      {filterByRole(routes, { userWebsiteRole }).map((m, i) => {
        const C = m.component;
        const renderProps = {
          ...props,
          currentRoute: m,
          routes: m.routes
            ? m.routes.map(r => {
                return {
                  ...r,

                  // - 组成： /gallery/home
                  // - 将//替换成/
                  path: m.path === '/' ? r.path : m.path + r.path,
                };
              })
            : null,
        };

        return (
          <Route
            exact={m.exact}
            key={m.id}
            path={m.path}
            render={reset => <C {...renderProps} {...reset} />}
          />
        );
      })}

      {/* 设置默认的路由跳转 */}
      {/* {getDefaultRedirect({ routes, location })} */}
    </Fragment>
  ) : null;

  const NewRouter = isHash ? HashRouter : BrowserRouter;

  return routeHtml ? (
    <NewRouter>
      {AuthorizedRoute ? (
        <AuthorizedRoute path="/" {...props}>
          {routeHtml}
        </AuthorizedRoute>
      ) : (
        routeHtml
      )}
    </NewRouter>
  ) : null;
};

export default renderRoutes;
