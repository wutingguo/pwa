import * as xhr from 'appsCommon/utils/xhr';
import { template } from 'lodash';

import { createFormData } from '@resource/lib/utils/uploadHelper';

import { elementTypes } from '@resource/lib/constants/strings';

import {
  SAVE_CUSTOM_THEME,
  UPLOAD_DESIGN_ASSET,
  UPLOAD_PAGE_THUMBNAIL,
  UPLOAD_PSD_HISTORY,
} from '@apps/theme-editor/constants/apiUrl';
import { getElementArray, getElementPageIdMap } from '@apps/theme-editor/utils/getDataFromState';
import { generateTheme } from '@apps/theme-editor/utils/projectGenerator';

import PromisePool from './pool';

const getPageThumbnail = page => {
  return new Promise((resolve, reject) => {
    const thumbnailOffset = page.get('thumbnailOffset');
    const thumbnailImage = page.get('thumbnailImage');
    const offsetX = thumbnailOffset.get('x');
    const offsetY = thumbnailOffset.get('y');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = page.get('width') + offsetX * 2;
    canvas.height = page.get('height') + offsetY * 2;
    ctx.drawImage(thumbnailImage, 0, 0);
    ctx.fillStyle = '#fff';
    ctx.fillRect(offsetX, offsetY, page.get('width'), page.get('height'));
    page
      .get('elements')
      .sort((a, b) => a.get('depth') - b.get('depth'))
      .forEach(ele => {
        ctx.drawImage(
          ele.get('image'),
          offsetX + ele.get('x'),
          offsetY + ele.get('y'),
          ele.get('width'),
          ele.get('height')
        );
      });
    canvas.toBlob(blob => {
      resolve(new File([blob], name, { type: 'image/jpeg' }));
    }, 'image/jpeg');
  });
};

//  上传单个page预览图
const uploadPageThumbnail = ({ page, baseUrl, updateCompletedRequests }) => {
  return new Promise(async (resolve, reject) => {
    let { thumbnail, id, isUpdatePage } = page.toJS();

    // 如果page有过改动 比如元素位置、大小、元素删减之类 则重新生成预览图
    if (isUpdatePage) {
      thumbnail = await getPageThumbnail(page);
    }

    const url = template(UPLOAD_PAGE_THUMBNAIL)({ baseUrl });
    const data = {
      file: thumbnail,
      page_code: id,
    };
    const opt = {
      setJSON: false,
    };
    xhr
      .post(url, createFormData(data), opt)
      .then(result => {
        const { ret_code, data = {} } = result;

        if (ret_code === 200000) {
          updateCompletedRequests();
          const obj = {
            ...page.toJS(),
            thumbnail: data.thumbnail_path,
          };
          resolve(obj);
        } else {
          reject(ret_code);
        }
      })
      .catch(e => {
        reject(e);
      });
  });
};

//  上传所有page预览图
export const uploadPageArrayThumbnail = ({ pageArray, baseUrl, updateCompletedRequests }) => {
  return new Promise((resolve, reject) => {
    const result = [];
    const pool = new PromisePool({
      executor: uploadPageThumbnail,
      success: data => {
        result.push(data);
      },
      error: err => {
        reject(err);
      },
      complete: () => {
        resolve(result);
      },
    });
    for (let i = 0; i < pageArray.size; i++) {
      const page = pageArray.get(i);
      pool.addTask({ page, baseUrl, updateCompletedRequests });
    }
  });
};

// 上传单个sticker/backgrounds
export const uploadDesignAsset = ({ pageArray, element, baseUrl, updateCompletedRequests }) => {
  return new Promise((resolve, reject) => {
    const { file, width, height, id, type, name, pictureWidth, pictureHeight } = element.toJS();
    const elementPageIdMap = getElementPageIdMap(pageArray);
    const thePageId = elementPageIdMap.get(id);
    const url = template(UPLOAD_DESIGN_ASSET)({ baseUrl });
    const data = {
      file,
      page_code: thePageId,
      resource_type: type === elementTypes.sticker ? '5' : '4', // sticker传5， backgrounds传4
      resource_name: '', // 蒙版是MK, 默认空
      picture_width: pictureWidth,
      picture_height: pictureHeight,
    };
    const opt = {
      setJSON: false,
    };
    xhr
      .post(url, createFormData(data), opt)
      .then(result => {
        const { ret_code, data = {} } = result;
        if (ret_code === 200000) {
          updateCompletedRequests();
          const item = {
            type,
            name,
            id,
            pageCode: thePageId,
            pictureSource: 0, // psd 解析出来的传0
            pictureId: data.asset_code,
            pictureWidth,
            pictureHeight,
          };
          resolve(item);
        } else {
          reject(ret_code);
        }
      })
      .catch(e => {
        reject(e);
      });
  });
};

// 上传全部设计素材
export const uploadDesignAssets = ({
  pageArray,
  elementArray,
  baseUrl,
  updateCompletedRequests,
}) => {
  return new Promise(async (resolve, reject) => {
    const result = [];
    const pool = new PromisePool({
      executor: uploadDesignAsset,
      success: data => {
        result.push(data);
      },
      error: err => {
        reject(err);
      },
      complete: () => {
        resolve(result);
      },
    });

    for (let i = 0; i < elementArray.size; i++) {
      const element = elementArray.get(i);
      pool.addTask({ pageArray, element, baseUrl, updateCompletedRequests });
    }
  });
};

const getCompletedRequestsFn = ({ totalRequests, setProgress }) => {
  let completedRequests = 0;
  return () => {
    completedRequests++;
    if (completedRequests > totalRequests) {
      return;
    }
    const progress = Math.round((completedRequests / totalRequests) * 100);
    setProgress(progress);
  };
};

// 保存主题
export const saveThemeProject = async ({ pageArray, baseUrl, title, setProgress }) => {
  try {
    const elementArray = getElementArray(pageArray);

    // 只上传背景和sticker元素的素材
    const needUploadElementArray = elementArray.filter(element =>
      [elementTypes.sticker, elementTypes.background].includes(element.get('type'))
    );

    const totalRequests = needUploadElementArray.size + pageArray.size + 1;
    const updateCompletedRequests = getCompletedRequestsFn({ totalRequests, setProgress });

    const assetsArray = await uploadDesignAssets({
      pageArray,
      elementArray: needUploadElementArray,
      baseUrl,
      updateCompletedRequests,
    });
    const backgrounds = assetsArray.filter(asset => asset.type === elementTypes.background);
    const stickers = assetsArray.filter(asset => asset.type === elementTypes.sticker);
    let pageArrayThumbnail = await uploadPageArrayThumbnail({
      pageArray,
      baseUrl,
      updateCompletedRequests,
    });

    // 重新矫正page的索引
    pageArrayThumbnail = pageArray.toJS().map(page => {
      const thumbnailPage = pageArrayThumbnail.find(item => item.id === page.id);
      return {
        ...page,
        thumbnail: thumbnailPage.thumbnail,
      };
    });
    const themeData = generateTheme({
      backgrounds,
      stickers,
      pageArray: pageArrayThumbnail,
      title,
    });
    const res = await save({ baseUrl, themeData, updateCompletedRequests });
    return res;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const save = ({ baseUrl, themeData, updateCompletedRequests }) => {
  return new Promise((resolve, reject) => {
    const url = template(SAVE_CUSTOM_THEME)({ baseUrl });
    xhr
      .post(url, themeData)
      .then(result => {
        const { ret_code, data = {} } = result;
        if (ret_code === 200000) {
          updateCompletedRequests();
          resolve(data);
        } else {
          reject(ret_code);
        }
      })
      .catch(e => {
        reject(e);
      });
  }).catch(e => {
    return Promise.reject(e);
  });
};

// 获取有没有成功保存过psd上传的主题
export const getUploadPsdHistory = baseUrl => {
  return new Promise((resolve, reject) => {
    const url = template(UPLOAD_PSD_HISTORY)({ baseUrl });
    xhr
      .get(url)
      .then(result => {
        const { ret_code, data } = result;
        if (ret_code === 200000) {
          resolve(data);
        } else {
          reject(ret_code);
        }
      })
      .catch(e => {
        reject(e);
      });
  }).catch(e => {
    return Promise.reject(e);
  });
};
