import React from 'react';
import qs from 'qs';
import { useLocation, useRouteMatch, Redirect } from 'react-router-dom';
import { getItem, setItem } from '@resource/lib/utils/cache';
import withAuth from './withAuth';

// 这些项目, 不需要初始化当前的路由.
const excludedPathnames = ['/gallery', '/designer', '/slide-show'];
// 中国用户 不是认证的专享会员 跳链接到申请专享认证页面
const jumpToCunxinWebsite = (userInfo) => {
  const isPlannerPlan = userInfo && userInfo.get('isPlannerPlan');
  if(__isCN__ && isPlannerPlan === false) {
    let url;
    if (origin.indexOf('saas.cnzno.com.dd') !== -1) {
      url = 'https://www.cnzno.com.dd';
    } else if (origin.indexOf('saas.cnzno.com.tt') !== -1) {
      url = 'https://www.cnzno.com.tt';
    } else {
      url = 'https://www.cunxin.com';
    }
    window.location.href = `${url}/maker-plan.html`;
  }
}

const noNeedLoginPages = [
  '/software/sign-in',
  '/software/sign-up',
  '/software/forgotten-password'
]

export default Comp => {
  return props => {
    const location = useLocation();
    const matches = useRouteMatch();

    // 判断是否为sign in
    const isSignInPage = location.pathname === '/software/sign-in';
    const isNoNeedLogin = noNeedLoginPages.indexOf(location.pathname) >= 0;

    // getuserinfo: 没有响应完成之前, 子组件不需要渲染.
    if (!props.isUserLoadCompleted && !isNoNeedLogin) {
      return null;
    }

    // 如果访问的是app的页面比如/gallery. 就不需要渲染src下的app组件.
    const isExcluded = excludedPathnames.find(m =>
      location.pathname.startsWith(m)
    );
    if (matches.path === '/' && isExcluded) {
      return null;
    }

    const { routes, userInfo, landingPage } = props;

    // 用户是否登录.
    const isLogined =
      userInfo && userInfo.get('id') && userInfo.get('id') !== -1;

    if (routes) {
      const route = routes.find(m => m.path === location.pathname);
      if (route && route.isAuth) {
        // 中国用户 不是认证的专享会员 跳链接到申请专享认证页面
        // jumpToCunxinWebsite(userInfo);
        let NewComp = getItem(route.id, {isMemory: true});
        if(!NewComp){
          NewComp = withAuth(Comp);
          setItem(route.id, NewComp, { isMemory: true });
        }

        return <NewComp isLogined={isLogined} {...props} />;
      }
    }

    // 如果已经登录了. 就跳转到landingPage页面.
    // if (isSignInPage && isLogined) {
    //   const qsParams = qs.parse(location.search.substr(1));
    //   const to = qsParams.url || landingPage || '/';
    //   // 中国用户 不是认证的专享会员 跳链接到申请专享认证页面
    //   jumpToCunxinWebsite(userInfo);
    //
    //   return <Redirect to={to} />;
    // }

    return <Comp {...props} />;
  };
};
