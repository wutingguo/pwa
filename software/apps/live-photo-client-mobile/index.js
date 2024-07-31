import React from 'react';
import { hot } from 'react-hot-loader/root';

import { initTranslate } from '@resource/lib/utils/translator';

import bootstrap from '@resource/pwa/bootstrap';

import { createAppStore } from '@resource/pwa/redux/store';

initProject();

async function initProject() {
  initTranslate([{ projectName: 'pwa-client' }]);

  const { default: routes } = await import('@apps/live-photo-client-mobile/config/routes');

  // reducer.
  const { default: reducer } = await import('@apps/live-photo-client-mobile/redux/reducer');

  const store = createAppStore(reducer, './redux/reducer', {});

  // 启动的容器组件.
  const { default: XClientApp } = await import('@resource/components/pwa-client-mobile/XApp');

  const appProps = {
    routes,
    helmet: {
      // title: t('LPCM_TITLE'),
      title: '', // 顶部名称展示优化 先显示空，再切换为b端设置的值，若b端设置的值为空，显示【照片直播平台】
    },
  };

  bootstrap(hot(XClientApp), store, 'live-photo-client-mobile', appProps);
}
