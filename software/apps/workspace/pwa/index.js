import sw from '@resource/pwa/utils/serviceworker';
import { actionTypes } from '@resource/pwa/utils/strings';
import { isGetMethod } from '@resource/pwa/utils/fetch/request';
import * as cacheStrategy from '@resource/pwa/utils/monitor/cacheStrategy';

const swInstance = new sw.XServiceWorker({
  immediate: true
});

// 所有需要监控的页面
let heartDetection = {};
const CHECK_HEALTH_TIME = 3000;

/**
 * 查找db中的图片, 并且发送回页面.
 * @param {*} event
 */
const findDbImagesAndSendToPage = event => {
  event.source.postMessage({
    type: actionTypes.getDatabaseImages,
    items: ['workspace 123']
  });
};


/**
 * 给对应的 client 发送消息
 * @param  {Object} client
 * @param  {Object} msg
 */
const sendMessageToClient = (client, msg) => {
  client.postMessage(msg);
};

/**
 * 注册当前访问页面，并发送注册成功信息
 * @param {*} sourceId 
 * @param {*} reportData 
 */
const registerThePage = (sourceId, reportData) => {
  console.log('sourceId: ', sourceId);
  heartDetection = {}; //
  self.clients.get(sourceId)
    .then(client => {
      heartDetection[sourceId] = {
        client,
        reportData,
        timer: setInterval(() => {
          checkHealth(sourceId);
        }, CHECK_HEALTH_TIME),
        flag: 'healthy'
      };
      sendMessageToClient(
        client,
        {
          type: actionTypes.registerSuccess,
          msg: '注册成功了！'
        }
      );
    })
    .catch(err => {
      console.log(err);
    })
}

/**
 * 根据 id 给主页面发送心跳包并检测是否存活
 * 下一个心跳包发送的的时候，上一个还没回来，则认为页面崩溃
 * @param  {String} id
 */
const checkHealth = id => {
  if (heartDetection[id]) {
    // 不健康就上报
    if (heartDetection[id].flag !== 'healthy') {
      // reportCrash(heartDetection[id].reportData);
      console.log("reportData: ", heartDetection[id].reportData);
      removeCheck(id);
      return;
    }
    // 设置成不健康，下次定时器的时候检查
    heartDetection[id].flag = 'unhealthy';
    sendMessageToClient(heartDetection[id].client, { type: actionTypes.checkHealth })
  }
}

/**
 * 心跳包规定时间内有回包，页面健康
 * @param {*} id 
 */
const switchToHealthy = id => {
  if(heartDetection[id]) {
    heartDetection[id].flag = 'healthy';
  }
}

/**
 * 清理心跳定时器，并从map中移除
 * @param  {String} id
 */
const removeCheck = id => {
  if (heartDetection[id]) {
    heartDetection[id].timer && clearInterval(heartDetection[id].timer);
    delete heartDetection[id];
  }
}

/**
 * onmessage handle
 * @param {*} event
 */
const messageHandle = event => {
  const { data, source } = event;
  const sourceId = source.id;
  const { type, reportData } = data;
  switch (type) {
    case actionTypes.getDatabaseImages: {
      // 获取db中的图片..
      findDbImagesAndSendToPage(event);
      break;
    }
    case actionTypes.registerPage: {
      // 注册当前页面
      registerThePage(sourceId, reportData);
      break;
    }
    case actionTypes.unregisterPage:
      // 移除当前页面
      removeCheck(sourceId);
      break;
    case actionTypes.keepHealth: {
      // 切换当前页面标识为健康
      switchToHealthy(sourceId);
      break;
    }
    default: {
      break;
    }
  }
};

/**
 * 自定义缓存策略
 * @param {*} event 
 */
const customCacheStrategy = event => {
  const {
    request,
    request: { url, method },
    respondWith
  } = event;
  const requestURL = new URL(url);
  const { pathname, host } = requestURL;

  if (isGetMethod) {
    if (pathname === '') {
      respondWith(cacheStrategy.networkOnly(request));
    } else if (pathname === '') {
      respondWith(cacheStrategy.cacheOnly(request));
    } else if (pathname === '') {
      respondWith(cacheStrategy.networkOrOffline(request));
    } else if (pathname === '') {
      respondWith(cacheStrategy.networkOrCache(request));
    } else if (pathname === '') {
      respondWith(cacheStrategy.networkAndCache(request, 'cache-name1'));
    } else if (pathname === '' || host === '') {
      respondWith(cacheStrategy.cacheOrNetworkAndCache(request, 'cache-name2'));
    } else if (host === '') {
      respondWith(cacheStrategy.cacheOrNetworkAndOffline(request, 'cache-name3'));
    } else {
      // 针对不同请求内容，制定相应缓存策略...
    }
  } else if (method === 'POST') {
    console.log('is Post method');
    // post 先网络后缓存
    respondWith(cacheStrategy.postNetworkAndCache(request, db.post_cache));
  }
}

const init = () => {
  swInstance.addEvent('message', event => {
    messageHandle(event);
  });
  // 消息推送
  swInstance.addEvent('push', e => {
    const data = e.data;
    if (data) {
      const promiseChain = Promise.resolve(data.json()).then(data =>
        self.registration.showNotification(data.title, {})
      );
      e.waitUntil(promiseChain);
    }
  });

  // 错误监控
  // error js 执行发生错误时触发
  swInstance.addEvent('error', event => {
    // 上报错误信息
    // 常用的属性：
    // event.message
    // event.filename
    // event.lineno
    // event.colno
    // event.error.stack
    console.log('error: ', event.error);
  });

  // unhandledrejection 处理没有显式捕获的 Promise 异常 
  swInstance.addEvent('unhandledrejection', event => {  
    // 上报错误信息
    // 常用的属性：
    // event.reason
    console.log('reson: ', event.reason);
  });

  // 缓存策略
  swInstance.addEvent('fetch', event => {
    customCacheStrategy(event);
  })
};

export default {
  install: init
};
