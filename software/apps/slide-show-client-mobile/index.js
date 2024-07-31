import React from 'react';
import { hot } from 'react-hot-loader/root';
import { initTranslate } from '@resource/lib/utils/translator';
import { createAppStore } from '@resource/pwa/redux/store';
import bootstrap from '@resource/pwa/bootstrap';

initProject();

async function initProject() {
  initTranslate([{ projectName: 'pwa-client' }]);

  const { default: routes } = await import('@apps/slide-show-client-mobile/config/routes');

  // reducer.
  const { default: reducer } = await import('@apps/slide-show-client-mobile/redux/reducer');

  const store = createAppStore(reducer, './redux/reducer', {});

  // 启动的容器组件.
  const {default: XClientApp} = await import('@resource/components/pwa-client-mobile/XApp');

  const helmet = {
    title: 'Slide Show'
  }

  const helmetCN = {
    title: '动感MV播放',
    description: '动感MV - 您的电子相册。',
    keywords: '动感MV,电子相册,照片视频,相册制作软件'
  }

  const appProps = {
    routes,
    helmet: __isCN__ ? helmetCN : helmet
  };

  bootstrap(hot(XClientApp), store, 'slide-show-client-mobile', appProps);
}
