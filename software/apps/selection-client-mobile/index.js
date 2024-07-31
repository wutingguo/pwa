import React from 'react';
import { hot } from 'react-hot-loader/root';
import { initTranslate } from '@resource/lib/utils/translator';
import { createAppStore } from '@resource/pwa/redux/store';
import bootstrap from '@resource/pwa/bootstrap';

initProject();

async function initProject() {
  initTranslate([{ projectName: 'pwa-client' }]);

  const { default: routes } = await import('@apps/selection-client-mobile/config/routes');

  // reducer.
  const { default: reducer } = await import('@apps/selection-client-mobile/redux/reducer');

  const store = createAppStore(reducer, './redux/reducer', {});

  // 启动的容器组件.
  const { default: XClientApp } = await import('@resource/components/pwa-client-mobile/XApp');

  const appProps = {
    routes,
    helmet: {
      title: __isCN__ ? '在线选品' : 'Gallery'
    }
  };

  bootstrap(hot(XClientApp), store, 'selection-client-mobile', appProps);
}
