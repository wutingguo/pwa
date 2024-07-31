import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { unregister } from '@resource/pwa/utils/serviceworker/helper';

// 注销 sw 的降级方案，线上通过接口
const isUnregistersw = false;

const init = () => {
  if (!isUnregistersw) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          // console.log('registration', registration)

          // 注销掉不是当前作用域的所有service worker(之前的)
          if(registration.scope.indexOf('/software/') === -1) {
            registration.unregister();
          }
        }

        // 注销之后再重新注册,当前作用域下的service worker
        OfflinePluginRuntime.install({
          onInstalled: function () {
            console.log('SW Event:', 'onInstalled');
          },

          onUpdating: () => {
            console.log('SW Event:', 'onUpdating');
          },
          onUpdateReady: () => {
            console.log('SW Event:', 'onUpdateReady');
            // Tells to new SW to take control immediately
            OfflinePluginRuntime.applyUpdate();
          },
          onUpdated: () => {
            console.log('SW Event:', 'pwa---onUpdated');
            if(localStorage.getItem("neibu")=="true"){
              alert("页面重新刷新了")
            }
            // Reload the webpage to load into the new version
            // window.location.reload();
          },

          onUpdateFailed: () => {
            console.log('SW Event:', 'onUpdateFailed');
          }
        });
      });
    }

  } else {
    unregister()
      .then(() => {
        console.log('SW 已注销')
      });
  }
};

export default {
  init
};