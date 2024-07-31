import { template } from 'lodash';
import { get } from 'lodash';

import { wrapPromise } from '@resource/lib/utils/promise';

import {
  ESTORE_CANCEL_ORDER,
  ESTORE_CART_ORDER_DETAIL,
  ESTORE_CHANGE_PRODUCT_ORDER,
  ESTORE_CONFIRM_PAYMENT_ORDER,
  ESTORE_GET_SPU_DETAIL,
  ESTORE_GET_TRACK_LIST,
  ESTORE_LAB_EXPORT,
  ESTORE_ORDER_LIST,
  ESTORE_SEND_TO_LAB,
  ESTORE_SHIPPING_ORDER,
  ESTORE_STORE_PHOTO_SELECTED,
  ESTORE_TRACK_PACKAGE,
  ESTORE_ORDER_SEND_DIGITAL_EMAIL,
  SAAS_CLIENT_GALLERY_GET_ZIP_DOWNLOAD_LINK,
} from '@resource/lib/constants/apiUrl';

import * as xhr from '@resource/websiteCommon/utils/xhr';

const changeProductOrder = ({ baseUrl, order_no }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_CHANGE_PRODUCT_ORDER)({
    baseUrl: cloudapiUrl,
  });
  const bodyParams = {
    order_no,
  };
  return xhr.post(url, bodyParams);
};

const confirmOrderPay = ({ baseUrl, order_no }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_CONFIRM_PAYMENT_ORDER)({
    baseUrl: cloudapiUrl,
  });
  const bodyParams = {
    order_no,
  };
  return xhr.post(url, bodyParams);
};

const shippingOrder = ({ baseUrl, order_no, shipment_number, courier }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_SHIPPING_ORDER)({
    baseUrl: cloudapiUrl,
  });
  const bodyParams = {
    order_no,
    shipment_number,
    courier,
  };
  return xhr.post(url, bodyParams);
};

const getTrackList = ({ baseUrl }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_GET_TRACK_LIST)({
    baseUrl: cloudapiUrl,
  });
  return xhr.get(url);
};

const getOrderDetail = ({ baseUrl, order_no }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_CART_ORDER_DETAIL)({
    baseUrl: cloudapiUrl,
    order_no,
  });
  return xhr.get(url);
};
const getSpuDetail = ({ baseUrl, spu_uuid }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_GET_SPU_DETAIL)({
    baseUrl: cloudapiUrl,
    spu_uuid,
  });
  return xhr.get(url);
};
const trackPackage = ({ baseUrl, order_no }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_TRACK_PACKAGE)({
    baseUrl: cloudapiUrl,
    order_no,
  });
  return xhr.get(url);
};
const sendToLab = ({ baseUrl, order_number, auth, cookieMap }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_SEND_TO_LAB)({
    baseUrl: cloudapiUrl,
  });
  const bodyParams = {
    order_number,
    zno_auth: {
      auth,
      cookie_data: cookieMap,
    },
  };
  return xhr.post(url, bodyParams);
};
const exportProject = ({ baseUrl, order_number, auth, cookieMap, order_item_id_list }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_LAB_EXPORT)({
    baseUrl: cloudapiUrl,
  });
  const bodyParams = {
    order_number,
    order_item_id_list,
    zno_auth: {
      auth,
      cookie_data: cookieMap,
    },
  };
  return xhr.post(url, bodyParams);
};

const cancelOrder = ({ baseUrl, order_no }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_CANCEL_ORDER)({
    baseUrl: cloudapiUrl,
  });
  const bodyParams = {
    order_no,
  };
  return xhr.post(url, bodyParams);
};
const getOrderlist = ({ baseUrl, store_id }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_ORDER_LIST)({
    baseUrl: cloudapiUrl,
    store_id,
  });
  return xhr.get(url);
};
const sendDigitalEmail = ({ baseUrl, order_no, send_to_b, item_ids }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_ORDER_SEND_DIGITAL_EMAIL)({
    baseUrl: cloudapiUrl,
  });
  const bodyParams = {
    order_no,
    send_to_b,
    item_ids,
  };
  return xhr.post(url, bodyParams);
};
const getDownloadUid = ({ baseUrl, order_item_id }) => {
  const url = template(ESTORE_STORE_PHOTO_SELECTED)({
    baseUrl,
  });
  const bodyParams = {
    order_item_id,
  };
  order_item_id;
  return xhr.post(url, bodyParams);
};
const getDownloadLink = ({ galleryBaseUrl, uuid }) => {
  return wrapPromise((resolve, reject) => {
    const url = template(SAAS_CLIENT_GALLERY_GET_ZIP_DOWNLOAD_LINK)({
      galleryBaseUrl,
      uuid,
      autoRandomNum: Date.now(),
    });
    xhr.get(url).then(response => {
      const downloadLink = get(response, 'data');

      if (!downloadLink) {
        resolve({
          isHasExistedZip: false,
        });
      }
      const index1 = downloadLink.lastIndexOf('/') + 1;
      const index2 = downloadLink.indexOf('.zip') + 4;
      const downloadName = decodeURI(downloadLink.slice(index1, index2));

      resolve({
        isHasExistedZip: true,
        downloadName,
        downloadUrl: downloadLink,
      });
    }, reject);
  });
};

export default {
  getOrderDetail,
  getOrderlist,
  sendToLab,
  cancelOrder,
  trackPackage,
  getSpuDetail,
  exportProject,
  changeProductOrder,
  shippingOrder,
  getTrackList,
  confirmOrderPay,
  getDownloadUid,
  getDownloadLink,
  sendDigitalEmail,
};
