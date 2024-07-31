import { getAiImgFaceRectangle, updateAvatar } from '@common/servers/classific_person';

export const updateAvatarFn = async (reset, callBack) => {
  const { baseUrl, params } = reset;
  const { enc_collection_id, enc_image_id } = params;
  getAiImgFaceRectangle({
    baseUrl,
    params: {
      enc_collection_id,
      enc_image_id,
    },
  }).then(data => {
    const { image_size, face_rectangle_list = [] } = data;
    let otherParams = { x: '0', y: '0', width: '0', height: '0' };
    if (Array.isArray(face_rectangle_list) && face_rectangle_list.length === 1) {
      const { height, width, x, y, position } = face_rectangle_list[0];
      otherParams = {
        height: `${height}`,
        width: `${width}`,
        x: `${x}`,
        y: `${y}`,
        image_size: image_size,
        position,
      };
    } else if (face_rectangle_list && face_rectangle_list[0]) {
      const { position } = face_rectangle_list[0];
      otherParams = { ...otherParams, position };
    }
    updateAvatar({ baseUrl, params: { ...params, ...otherParams } }).then(res => {
      callBack && callBack(res);
    });
  });
};

export const updateAvatarNameFn = (reset, callBack) => {
  const { baseUrl, params } = reset;
  updateAvatar({ baseUrl, params }).then(res => {
    callBack && callBack(res);
  });
};
