import { fromJS } from 'immutable';

const emptyArr = fromJS([]);
const emptyMap = fromJS({});

const getUrlsHelper = urls => {
  if (!__isCN__) {
    // 因为美国的SaaS就在www域名下，并且目前项目中大量存在使用galleryBaseUrl的情况，存在跨域问题。
    // 所以在此同一替换为baseUrl
    return urls.merge({
      galleryBaseUrl: urls.get('baseUrl')
    });
  }
  return urls;
};
export { getUrlsHelper };
