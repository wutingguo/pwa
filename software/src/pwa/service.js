import sw from '@resource/pwa/utils/serviceworker';

const swInstance = new sw.XServiceWorker({
  immediate: true
});

/**
 * sass容器项目中, 使用sw需要做的任务.
 */
const init = () => {
  swInstance.addEvent('message', event => {
    console.log(event);
  });
};

export default {
  install: init
};