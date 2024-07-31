import React from 'react';
import { hot } from 'react-hot-loader/root';
import { initTranslate } from '@resource/lib/utils/translator';
import { createAppStore } from '@resource/pwa/redux/store';
import bootstrap from '@resource/pwa/bootstrap';

initProject();

async function initProject() {
  initTranslate([{ projectName: 'pwa-client' }]);

  const { default: routes } = await import('@apps/commodity-client/config/routes');

  // reducer.
  const { default: reducer } = await import('@apps/commodity-client/redux/reducer');

  const store = createAppStore(reducer, './redux/reducer', {});

  // 启动的容器组件.
  const { XClientApp } = await import('@common/components');

  const appProps = {
    routes,
    helmet: {
      title: __isCN__ ? '商品库' : 'Gallery'
    }
  };

  bootstrap(hot(XClientApp), store, 'commodity-client', appProps);
}
