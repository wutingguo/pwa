import sw from '@resource/pwa/utils/serviceworker';
import {onCachefetch} from './fetch-cache';

const swInstance = new sw.XServiceWorker({
  immediate: true,
  cacheName: `sass-${__VERSION__}`
});

// 清除老的cache.
swInstance.clearCache();

/**
 * sass容器项目中, 使用sw需要做的任务.
 */
const init = () => {
  swInstance.addEvent('message', event => {
    console.log(event);
  });

  swInstance.addEvent('fetch', event => {
    if (!(event.request.url.indexOf('http') === 0)) return;
    onCachefetch(event, swInstance);
  });
};

export default {
  install: init
};