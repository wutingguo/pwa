import React from 'react';
import { hot } from 'react-hot-loader/root';

import { getCookie, removeCookie, setCookie } from '@resource/lib/utils/cookie';
import { initTranslate } from '@resource/lib/utils/translator';
import { getWWWorigin } from '@resource/lib/utils/url';

import bootstrap from '@resource/pwa/bootstrap';

import { createAppStore } from '@resource/pwa/redux/store';

import { miniProgramLogin } from '@apps/dashboard-mobile/utils/service';

//写入小程序缓存
const wxAbout = async () => {
  const getQs = name => {
    // if (!window.location.search.includes('?')) {
    //   return null;
    // }
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    // const r = window.location.search.split('?')[1].match(reg);
    const r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return r[2];
    }
    return null;
  };
  if (typeof window !== 'undefined') {
    // clearAllCookie(); //清楚所有Cookie
    const source = getQs('sourceFrom');
    if (source) {
      const host = location.host
        .split('.')
        .filter((a, index) => index !== 0)
        .join('.');
      if (getCookie('_auth_token')) {
        removeCookie('_auth_token', host);
      }
      if (source === 'mp') {
        // 来自小程序
        setCookie('isFromMp', true);
        setCookie('isFromWp', '');
        setCookie('_auth_token', getQs('auth_token'));
        const baseUrl = getWWWorigin();
        await miniProgramLogin({ auth_token: getQs('auth_token'), baseUrl });
        setCookie('_auth_token', getQs('auth_token')); //再次重置_auth_token Cookie
        // alert(getCookie('_auth_token'));
      }
    }
  }
};

initProject();

async function initProject() {
  await wxAbout(); //执行微信相关逻辑 写入相关缓存
  initTranslate([{ projectName: 'dashboard-mobile' }, { projectName: 'pwa' }]);

  const { default: routes } = await import('@apps/dashboard-mobile/config/routes');

  // reducer.
  const { default: reducer } = await import('@apps/dashboard-mobile/redux/reducer');

  const store = createAppStore(reducer, './redux/reducer', {});

  // 启动的容器组件.
  const { default: XClientApp } = await import('@resource/components/pwa-mobile/XApp');

  const appProps = {
    routes,
    helmet: {
      title: __isCN__ ? '选片软件' : 'Gallery',
    },
  };
  bootstrap(hot(XClientApp), store, 'dashboard-mobile', appProps);
}
