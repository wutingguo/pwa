import React from 'react';
import { hot } from 'react-hot-loader/root';
import { initTranslate } from '@resource/lib/utils/translator';
import { createAppStore } from '@resource/pwa/redux/store';
import bootstrap from '@resource/pwa/bootstrap';

initProject();

async function initProject() {
  initTranslate([{ projectName: 'pwa-client' }]);

  const { default: routes } = await import('@apps/gallery-client-mobile/config/routes');

  // reducer.
  const { default: reducer } = await import('@apps/gallery-client-mobile/redux/reducer');

  const store = createAppStore(reducer, './redux/reducer', {});

  // 启动的容器组件.
  const { default: XClientApp } = await import('@resource/components/pwa-client-mobile/XApp');

  const appProps = {
    routes,
    helmet: {
      title: __isCN__ ? '选片软件' : 'Gallery'
    }
  };

  bootstrap(hot(XClientApp), store, 'gallery-client-mobile', appProps);
}
