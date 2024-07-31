import request from '@resource/websiteCommon/utils/ajax';
import { convertObjIn } from '@resource/websiteCommon/utils/typeConverter';

export const formatWeddingBookCalculateInfo = rawData => {
  const { selectionList, selections, preSaleTime } = rawData;
  const { selectionNames, selectionDisplayNames } = selections;

  return {
    selectionList,
    selectionNames,
    selectionDisplayNames,
    preSaleTime
  };
};

export const fetchCalculateInfo = ({ product, baseUrl }) => {
  return new Promise((resolve, reject) => {
    let url = baseUrl + 'product-page/calculateTmp/';

    if (
      product === 'FloatFrame' ||
      product === 'FolioGroup' ||
      product === 'magneticgcanvasGroup'
    ) {
      url += 'prodType/';
    }

    request({
      url: `${url}${product}?_=${new Date().getTime()}`,
      success: res => {
        try {
          const result = JSON.parse(res);
          const { data } = convertObjIn(result);

          resolve(data);
        } catch (e) {
          console.error('get calculate api failed');
          reject();
        }
      },
      error: reject
    });
  });
};
