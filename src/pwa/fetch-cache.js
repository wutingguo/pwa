
// 定义支持cache的文件类型.
const requestCaches = [
  '.wasm$',
  '.js$',
  '.json$',
  '.css$',
  '.ico$',
  '.jpg$',
  '.png$',
  '.gif$',
  '.svg$',
  '.jpg$',
  '.webp$',
  '.wasm$'
];

const devEnvs = [
  'sockjs-node'
]

const wrapError = fn => {
  try {
    if(fn){
      return fn();
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * mock一个response, 防止控制台报错.
 * @param {*} event 
 */
const onDevEnvs = event => {
  return wrapError(() => {
    const newReponse = new Response({}, {
      status: 200,
      statusText: 'ok'
    });
  
    return event.respondWith(newReponse);
  });  
};

const onNetworkOnly = event => {
  return wrapError(() => {
    event.respondWith(async () => {
      const promise = fetch(event.request);
      event.waitUntil(promise);
  
      return promise;
    });
  })
};

const onCacheFirst = (event, cache) => {
  return wrapError(() => {
    event.respondWith(
      cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
  }) 
};

const checkShouldCache = url => {
  return requestCaches.some(s => {
    const reg = new RegExp(s);
    return reg.test(url);
  });
};

const isDevApi = url => {
  return devEnvs.some(s => {
    const reg = new RegExp(s);
    return reg.test(url);
  });
};

const onCachefetch = (event, swInstance) => {
  caches.open(swInstance.cacheName).then(function (cache) {
    const isDev = isDevApi(event.request.url);
    if(isDev){
      return onDevEnvs(event)
    }

    const isPost = event.request.method === 'POST';
    if (isPost) {
      return onNetworkOnly(event);
    }

    const shouldCache = checkShouldCache(event.request.url);
    if (shouldCache) {
      return onCacheFirst(event, cache);
    }

    return onNetworkOnly(event);
  })
};

export {
  onCachefetch
}