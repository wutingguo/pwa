import { template } from 'lodash';
import request from '@resource/lib/utils/ajax';
import x2jsInstance from '@resource/lib/utils/xml2js';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import { createImageFormData } from '@resource/lib/utils/uploadHelper';
import { SAAS_CHANGE_COLLECTION_COVER_IMAGE } from '@resource/lib/constants/apiUrl';
import { isAcceptFile } from '@resource/lib/utils/uploadFileCheck';

const computedProgress = progressEvent => {
  const { loaded, total, lengthComputable } = progressEvent;
  let percent = 0;

  if (lengthComputable) {
    if (!isNaN(loaded) && !isNaN(loaded)) {
      percent = Math.round((loaded / total) * 100);
    }
  }

  return percent;
};

const uploadFile = (that, file) => {
  const { data } = that.props;
  const collection_uid = data.get('collection_uid');
  const galleryBaseUrl = data.get('galleryBaseUrl');
  const close = data.get('close');

  const url = template(SAAS_CHANGE_COLLECTION_COVER_IMAGE)({ galleryBaseUrl });

  const xhr = new XMLHttpRequest();
  const formData = createImageFormData({
    file,
    collection_uid
  });

  // 校验上传内容
  const errorInfo = isAcceptFile(file, 50);
  const { isAccept, errorText } = errorInfo;

  that.setState({
    isUploading: isAccept,
    hasError: !isAccept,
    progress: 0,
    errorText
  });

  if (isAccept) {
    request(
      {
        url,
        method: 'post',
        data: formData,
        setHead: false,
        success: (res, options) => {
          console.log('res: ', res);
          let resObj;
          try {
            resObj = convertObjIn(JSON.parse(res));
          } catch (error) {
            resObj = convertObjIn(x2jsInstance.xml2js(res));
          }
          const { ret_code } = resObj;
          console.log(ret_code, typeof ret_code);
          that.setState({
            isUploading: false,
            hasError: ret_code === 50000 ? true : false,
            progress: 100
          });

          close && close(resObj.data);
        },
        progress: res => {
          const percent = computedProgress(res);

          that.setState({
            progress: percent
          });
        },
        error: (err, options) => {
          console.log('err: ', err);

          that.setState({
            isUploading: false,
            hasError: true
          });
        }
      },
      xhr
    );
  }
};

const onAddImages = (that, files) => {
  if (files && files.length) {
    const file = files[0];
    uploadFile(that, file);
  }
};

export default { onAddImages };
