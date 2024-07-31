import React from 'react';
import { Provider } from 'react-redux';

import { createAppStore } from '@resource/pwa/redux/store';

import slideshowAutoSaveMiddleware from '@apps/slide-show/redux/middlewares/autoSave';

const routes = require('@resource/pwa/utils/routes').default;

// 启动的容器组件.
const { XApp } = require('@common/components');
const appProps = {
  routes,
  helmetConfig: __isCN__
    ? {
        title: '寸心云服 | 工作台---影像软件云平台，引领影楼、工作室步入云时代',
      }
    : {
        title:
          'Zno Cloud Platform - The most synergystic suite of photography business tools ever created.',
        description:
          'Zno Cloud Platform - The most synergystic suite of photography business tools ever created',
        keywords: 'Zno, Album Design Software, Gallery Software, Slideshow',
      },
};

export default props => {
  // reducer.
  const { default: reducer } = require('@src/redux/reducer');
  const store = createAppStore(reducer, './redux/reducer', {}, [slideshowAutoSaveMiddleware]);

  return (
    <Provider store={store}>
      <XApp {...props} {...appProps} />
    </Provider>
  );
};
