import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchImage } from '@resource/lib/utils/image';

import { useSetting } from '@apps/live-photo-client-mobile/constants/context';
import {
  AVATAR_SEARCH_DRAWER,
  CLAUSE_DRAWER,
} from '@apps/live-photo-client-mobile/constants/modalTypes';
import { getAIFaceInfo } from '@apps/live-photo-client-mobile/servers';
import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';
import { getFaceAvatarSrc } from '@apps/live-photo-client-mobile/utils/utils';

import './index.scss';

/**
 * 点击头像查看照片
 * @typedef {object} AvatarViewProps
 * @property {Function} boundGlobalActions 弹窗操作
 * @property {string} envUrls 域名envUrls
 * @property {object} currentItem 当前图片的信息
 * @property {Function} handleClose 关闭大图弹窗
 * @param {AvatarViewProps} props
 */
const AvatarView = props => {
  const { getImageId } = useSetting();
  const { boundGlobalActions, envUrls, currentItem, handleClose } = props;
  const baseUrl = envUrls.get('saasBaseUrl');
  // 获取url参数enc_broadcast_id
  const search = new URLSearchParams(window.location.search);
  const enc_broadcast_id = search.get('enc_broadcast_id');
  // 获取活动信息
  const activityInfo = useSelector(state => state.activityInfo.get('ai_face_vo')?.toJS());
  // 头像列表
  const [itemList, setItemList] = useState([]);

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
    setItemList(newList);
  };

  /**
   * 一次性获取头像背景图
   */
  const getAvatarImageInfo = async () => {
    const enc_image_uid = getImageId(currentItem);
    const originSrc = getRotateImageUrl({ baseUrl, enc_image_uid, thumbnail_size: 5 });
    const avatarImg = await fetchImage(originSrc);
    return avatarImg;
  };

  /**
   * 获取人脸识别的所有头像信息
   */
  const getAvatarData = async () => {
    try {
      const params = {
        baseUrl,
        enc_broadcast_id,
        enc_image_id: currentItem?.enc_content_id,
      };
      const res = await getAIFaceInfo(params);
      if (res.ret_code === 400337) {
        setItemList([]);
        return;
      }
      const list = res?.data?.item_list || [];
      setItemList(list);
      const imgInfo = await getAvatarImageInfo();
      for (let i = 0; i < list.length; i++) {
        getFaceAvatarByOne({ item: list[i], list, imgInfo });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 初始化获取头像信息
   */
  useEffect(() => {
    if (!activityInfo?.auto_detect) {
      return;
    }
    getAvatarData();
  }, [currentItem]);

  /**
   * 打开协议弹窗
   */
  const openClause = () => {
    const { showModal, hideModal } = boundGlobalActions;
    showModal(CLAUSE_DRAWER, {
      handleClose: () => {
        hideModal(CLAUSE_DRAWER);
      },
      style: { zIndex: 2000000002 },
    });
  };

  /**
   * 点击头像进入详情页
   * @param {object} item 头像信息
   */
  const handleClickAvatar = item => {
    const { showModal, hideModal } = boundGlobalActions;
    const imageId = getImageId(currentItem);
    hideModal(AVATAR_SEARCH_DRAWER); // 先关闭搜索弹窗
    showModal(AVATAR_SEARCH_DRAWER, {
      handleClose: () => {
        hideModal(AVATAR_SEARCH_DRAWER);
      },
      imageId,
      baseUrl,
      largeInfo: item,
    });
    // 关闭查看大图弹窗
    handleClose?.();
  };

  /**
   * 当开启了人脸识别功能时，才会显示
   */
  if (!activityInfo?.auto_detect || itemList.length === 0) {
    return null;
  }

  return (
    <section className="avatarView">
      <h4 className="avatarView__title">{t('LIVE_CLIENT_VIEW_PROFILE_PHOTO')}</h4>
      <p className="avatarView__clause" onClick={openClause}>
        {t('LIVE_CLIENT_VIEW_CLAUSE')}
      </p>
      <div className="avatarView__content">
        {itemList.map(item => (
          <img
            key={item.face_token}
            className="item"
            onClick={() => handleClickAvatar(item)}
            src={item?.avatarSrc}
          />
        ))}
      </div>
    </section>
  );
};

export default AvatarView;
