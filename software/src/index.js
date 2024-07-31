import React from 'react';
import { hot } from 'react-hot-loader/root';

import { initTranslate } from '@resource/lib/utils/translator';

import bootstrap from '@resource/pwa/bootstrap';

import { createAppStore, getInitState } from '@resource/pwa/redux/store';

import slideshowAutoSaveMiddleware from '@apps/slide-show/redux/middlewares/autoSave';

initProject();

async function initProject() {
  initTranslate([{ projectName: 'pwa' }, { projectName: 'apistatus' }]);

  const { default: routes } = await import('@resource/pwa/utils/routes');
  // reducer.
  const { default: reducer } = await import('@src/redux/reducer');

  // 创建store.
  const initState = await getInitState('pwa');

  const store = createAppStore(reducer, './redux/reducer', initState, [
    slideshowAutoSaveMiddleware,
  ]);

  // 启动的容器组件.
  const { XApp } = await import('@common/components');

  const appProps = {
    routes,
  };

  // console.log('routes: ', routes);

  bootstrap(hot(XApp), store, 'pwa', appProps);
}
