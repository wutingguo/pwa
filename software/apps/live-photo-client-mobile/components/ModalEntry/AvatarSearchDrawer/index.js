import cls from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchImage } from '@resource/lib/utils/image';

import { LIVE_PHOTO_VERIFY_WATERMARK } from '@common/constants/strings';

import { Authority } from '@common/utils/localStorage';

import BaseDrawer from '@apps/live-photo-client-mobile/components/BaseDrawer';
import LazyImage from '@apps/live-photo-client-mobile/components/LazyImage';
import loadingSrc from '@apps/live-photo-client-mobile/components/ModalEntry/ImageViewer/img/loading.gif';
import { useSetting } from '@apps/live-photo-client-mobile/constants/context';
import {
  CUSTOM_FORM_MODAL,
  IMAGE_VIEWER_MODAL,
} from '@apps/live-photo-client-mobile/constants/modalTypes';
import {
  getFaceDetectInfo,
  getImagePrivacySimilarFace,
  getImageWithFaceInfo,
  getImageWithSimilarFace,
  submitFaceDetectInfo,
} from '@apps/live-photo-client-mobile/servers';
import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';
import { getFaceAvatarSrc } from '@apps/live-photo-client-mobile/utils/utils';
import FButton from '@apps/live/components/FButton';

import './index.scss';

// 本地存储第一次登记表单
const auth = new Authority();

export default function AvatarSearchDrawer(props) {
  // 获取url参数enc_broadcast_id
  const search = new URLSearchParams(window.location.search);
  const enc_broadcast_id = search.get('enc_broadcast_id');
  const { data } = props;
  const { handleClose, imageId, baseUrl, largeInfo, selfieCheckInEnable, submitId } = data.toJS();
  const [avatarList, setAvatarList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const isCn = __isCN__;
  const pageSetting = useSetting();
  const activityInfo = useSelector(state => state.activityInfo);
  const formConfigVo = activityInfo.get('form_config_vo')?.toJS();

  // 登记表单号，一个相册id只能登记一次
  const registerID = `${enc_broadcast_id}-register-form`;

  // console.log('imageId', imageId, baseUrl);
  useEffect(() => {
    // 从查看大图进入直接跳过
    if (!imageId || !!largeInfo) return;
    queryAvatarList();
  }, [imageId, largeInfo?.face_token]);

  /**
   * 从查看大图进入，直接使用largeInfo查询
   */
  useEffect(() => {
    if (!largeInfo) return;
    handleSearch(largeInfo);
    getAvatarSrc([{ ...largeInfo }]);
  }, [largeInfo?.face_token]);

  /**
   * 一个一个截取头像
   */
  const getFaceAvatarByOne = async ({ item, list, imgInfo }) => {
    const { face_token } = item;
    let avatarSrc;
    try {
      avatarSrc = await getFaceAvatarSrc({ imgInfo, item });
      item.avatarSrc = avatarSrc;
    } catch (error) {
      avatarSrc = '';
    }
    const newList = [...list];
    const index = newList.findIndex(item => item.face_token === face_token);
    newList[index] = item;
    setAvatarList(newList);
  };

  /**
   * 一次性获取头像背景图
   */
  const getAvatarImageInfo = async () => {
    const enc_image_uid = imageId;
    const originSrc = getRotateImageUrl({ baseUrl, enc_image_uid, thumbnail_size: 5 });
    const avatarImg = await fetchImage(originSrc);
    return avatarImg;
  };

  /**
   * 异步设置头像
   * @param {Array} list 数据
   */
  async function getAvatarSrc(list) {
    const imgInfo = await getAvatarImageInfo();
    for (let i = 0; i < list.length; i++) {
      getFaceAvatarByOne({ item: list[i], list, imgInfo });
    }
  }

  // 获取头像列表
  async function queryAvatarList() {
    const params = {
      baseUrl,
      enc_image_id: imageId,
    };
    const selfParams = { ...params, enc_broadcast_id };
    let fetchApi;
    // 开启隐私模式下，使用其专业的检测接口
    if (selfieCheckInEnable) {
      fetchApi = () => getFaceDetectInfo(selfParams);
    } else {
      fetchApi = () => getImageWithFaceInfo(params);
    }
    setLoading(true);
    try {
      const res = await fetchApi();
      setLoading(false);
      if (res.ret_code === 400337) {
        return;
      }
      const { item_list = [] } = res.data;
      const newAvatarList = [...item_list];

      if (newAvatarList.length > 0) {
        const avatar = newAvatarList[0];
        handleSearch(avatar);
      }
      setAvatarList(newAvatarList);
      getAvatarSrc(newAvatarList);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  /**
   * 获取相似图片列表
   * @param {string} face_token
   * @returns
   * */
  async function queryImageListWithSimilarFace(face_token) {
    const params = {
      baseUrl,
      face_token,
      enc_broadcast_id,
    };
    setLoading(true);
    try {
      // 开启隐私模式下，使用其专业的检测接口
      const fetchApi = selfieCheckInEnable ? getImagePrivacySimilarFace : getImageWithSimilarFace;
      const res = await fetchApi(params);
      const newImageList =
        res.data.map(item => {
          const sourceUrl = getRotateImageUrl({ baseUrl, enc_image_uid: item.show_enc_content_id });
          return {
            ...item,
            ...item?.content,
            sourceUrl,
          };
        }) || [];
      setImageList(newImageList);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }
  function handleSearch(record) {
    queryImageListWithSimilarFace(record.face_token);
    setCurrent(record);
  }

  /**
   * 查看大图
   * @param {number} index 当前序号
   * @param {Array} imageList 当前所有图片信息
   * @param {object} options 额外参数
   */
  async function handleViewImager(index, imageList, option = {}) {
    const { boundGlobalActions } = props;
    const { showModal, hideModal } = boundGlobalActions;
    const { total } = option;
    if (
      isCn &&
      pageSetting?.watermark === LIVE_PHOTO_VERIFY_WATERMARK &&
      formConfigVo?.popup_type === 2 &&
      !auth.hasCode(registerID) &&
      formConfigVo?.enabled
    ) {
      showModal(CUSTOM_FORM_MODAL, {
        onSuccess: () => {
          showModal(IMAGE_VIEWER_MODAL, {
            photoList: imageList,
            index,
            total,
            handleClose: () => {
              hideModal(IMAGE_VIEWER_MODAL);
            },
          });
        },
      });
      return;
    }
    showModal(IMAGE_VIEWER_MODAL, {
      photoList: imageList,
      index,
      total,
      handleClose: () => {
        hideModal(IMAGE_VIEWER_MODAL);
      },
    });
  }

  /**
   * 提交选中人脸
   */
  async function submitFace() {
    try {
      const params = {
        baseUrl,
        detail_id: current?.detail_id,
        submit_id: submitId,
      };
      await submitFaceDetectInfo(params);
    } catch (error) {
      console.error(error);
    }
  }

  const searchTip = window.t('LIVE_AI_FACE_SEARCH_IMAGES', { count: imageList.length });
  return (
    <BaseDrawer
      open
      maskClick={handleClose}
      style={{ display: 'block' }}
      contentStyle={{ height: '100%' }}
    >
      <div className="avatar_search_drawer">
        {loading && (
          <div className="avatar_search_loading">
            <img src={loadingSrc} />
          </div>
        )}
        <div className={cls({ avatar_search_title: isCn, avatar_search_title_us: !isCn })}>
          {t('LIVE_CLIENT_VIEW_PROFILE_PHOTO')}
        </div>
        {/* US-直播 开启隐私模式下隐藏返回 */}
        {!selfieCheckInEnable && (
          <span className="avatar_search_back" onClick={handleClose}>
            &lt; {t('LIVE_AI_FACE_BACK')}
          </span>
        )}
        {avatarList.length > 0 ? (
          <div className="avatar_search_content">
            <div className="avatar_search_list">
              {avatarList.map(item => (
                <img
                  key={item.face_token}
                  className={cls('avatar_search_item', {
                    current: item.face_token === current?.face_token,
                  })}
                  onClick={() => handleSearch(item)}
                  src={item.avatarSrc}
                />
              ))}
            </div>
            {/* US-直播 隐私模式下提交选中人脸头像按钮 */}
            {!isCn && selfieCheckInEnable && (
              <FButton
                className={cls('avatar_search_submit_face', { disabled: !current })}
                onClick={submitFace}
              >
                OK
              </FButton>
            )}
            <div className={cls('avatar_search_tip')}>{searchTip}</div>
            <div className={cls('avatar_image_list', { isShow: imageList.length === 0 })}>
              {imageList.map((item, index) => {
                return (
                  <div
                    className={cls('avatar_image_item')}
                    key={item.show_enc_content_id}
                    onClick={() => handleViewImager(index, imageList, { total: imageList.length })}
                  >
                    <LazyImage
                      lazy
                      src={item.sourceUrl}
                      className="image-lazy"
                      style={{ maxHeight: '100%', maxWidth: '100%', width: '100%', height: 'auto' }}
                      fit="cover"
                    />
                  </div>
                );
              })}
            </div>
            <div className={cls('avatar_bottom')}>
              <div
                className={cls('avatar_bottom_line')}
                data-tip={t('LIVE_AI_FACE_PAGE_END_TIP')}
              ></div>
            </div>
          </div>
        ) : (
          <p className="avatar_search_empty">{t('LIVE_AI_FACE_SEARCH_IMAGES_EMPTY')}</p>
        )}
      </div>
    </BaseDrawer>
  );
}
