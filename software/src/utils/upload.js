import { GET_ALBUM_ID, UPLOAD_IMG, IMAGE_SRC } from '@apps/workspace/constants/apiUrl';
import { template } from '@apps/workspace/utils/template';
import { createImageFormData } from '@resource/websiteCommon/utils/uploadHelper';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import getPuid from '@resource/websiteCommon/utils/getPuid';

export function getAlbumId({ baseUrl, userInfo }) {
  const { uidPk } = userInfo;

  return new Promise((resolve, reject) => {
    if (uidPk) {
      const url = template(GET_ALBUM_ID, {
        userid: uidPk,
        albumName: encodeURIComponent('未命名'),
        autoRandomNum: Date.now(),
        baseUrl
      });
      xhr.pureget(url).then(res => {
        if (res.resultData && res.resultData.albumId) {
          resolve(res.resultData.albumId);
        } else {
          reject();
        }
      });
    } else {
      reject('userInfo缺失');
    }
  });
}

export function doUploadFile({ albumId, file, options = {}, userInfo, uploadBaseUrl }) {
  const { uidPk, securityToken, timestamp } = userInfo;

  return new Promise((resolve, reject) => {
    const url = template(UPLOAD_IMG, {
      uploadBaseUrl,
      ...options
    });
    xhr
      .purepost(
        url,
        createImageFormData({
          projectTitle: '未命名',
          Filename: file.name.replace(/[\&\/\_]+/g, ''),
          filename: file,
          uid: uidPk,
          token: securityToken,
          timestamp,
          albumId
        })
      )
      .then(res => {
        if (res && res.resultData.img) {
          resolve(Object.assign({}, res.resultData.img, {
            src: template(IMAGE_SRC, {
              uploadBaseUrl,
              encImgId: getPuid(res.resultData.img.encImgId)
            })
          }));
        } else {
          reject(res.resultData.failType);
        }
      });
  });
}


export function uploadFile({ file, params = {}, baseUrl, userInfo, uploadBaseUrl }) {
  const options = Object.assign({}, {
    size: '',
    isNeedResize: false,
    isCheckDpi: false
  }, params);
  return new Promise((resolve, reject) => {
    getAlbumId({ baseUrl, userInfo })
      .then(albumId => {
        doUploadFile({ albumId, file, options, userInfo, uploadBaseUrl })
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}
