import * as singleSpa from 'single-spa';
import * as isActive from '@src/utils/activity.js';

// 加入扩展. 在生产环境上移除console.
import '@resource/lib/extension';

import { saasAppNames } from '@resource/lib/constants/strings';
import { initLogEvent } from '@resource/lib/utils/global';
import initPfc from '@resource/lib/perfectlyClear/init';
import { GlobalEvent } from '@src/utils/global-event'
import { loadApp } from '@src/utils/loader'
import lifeCycle from '@src/utils/app-lifecycle';
import pwa from '@src/pwa/init';

async function init() {
  const globalEvent = new GlobalEvent(singleSpa);
  const loadingPromises = [];

  // 添加single-spa的生命周期的事件监听.
  lifeCycle.init();
  pwa.init();

  // 高级图像处理初始化.
  initPfc();

  // 初始化埋点sdk.
  initLogEvent('pwa');

  loadingPromises.push(loadApp({
    name: saasAppNames.navbar,
    actived: isActive.navbar,
    appURL: '@portal/navbar',
    storeURL: '@portal/navbar-store',
    globalEvent
  }));

  loadingPromises.push(loadApp({
    name: saasAppNames.software,
    actived: isActive.software,
    appURL: '@portal/software',   
    globalEvent
  }));

  // loadingPromises.push(loadApp({
  //   name: saasAppNames.designer,
  //   actived: isActive.designer,
  //   appURL: '@portal/designer',
  //   globalEvent
  // }));

  await Promise.all(loadingPromises);

  singleSpa.start()
}

init();