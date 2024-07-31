import { template } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

import { SAAS_GET_IMAGE_WITH_ORIENTATION_URL } from '@resource/lib/constants/apiUrl';

import {
  changeGroup,
  getAiGroupHeadList,
  getFreshCount,
  getFreshImages,
} from '@common/servers/classific_person';

import { RelateToPersonDrawer, XLoading, XModal } from '@common/components';

import GroupList from './components/GroupList';
import PhotosInGroupList from './components/PhotosInGroupList';
import { EnterType } from './constant';
import { updateAvatarFn, updateAvatarNameFn } from './handle/main';

import './index.scss';

const AIGroupsModal = props => {
  const [showDrawer, setShowDrawer] = useState({
    show: false,
    selectedImgId: '',
    sourceGroupId: '',
  });
  const [groupCollection, setGroupCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [curGroupId, setCurGroupId] = useState('');
  const [curAvatarName, setCurrentAvatarName] = useState('');
  const cacheHead = useRef({});

  const { closeModal, data, urls, boundGlobalActions } = props;
  const collectionDetail = data.get('collectionDetail');
  const onSmartSharding = data.get('onSmartSharding');
  const enterType = data.get('enterType');
  const enc_collection_id = collectionDetail.get('enc_collection_uid');
  const collectionName = collectionDetail.get('collection_name');
  const baseUrl = urls.get('galleryBaseUrl');

  useEffect(() => {
    if (enc_collection_id) {
      getCommonList();
    }
  }, [enc_collection_id]);

  const templateImg = (imgId, orientation) => {
    return template(SAAS_GET_IMAGE_WITH_ORIENTATION_URL)({
      galleryBaseUrl: baseUrl,
      image_uid: imgId,
      thumbnail_size: 5,
      with_exif: orientation || 1,
    });
  };

  const getLastestList = async (concatList, justVerify) => {
    const lastestCount = await getFreshCount({ baseUrl, enc_collection_id });
    if (lastestCount > 0 && !justVerify) {
      const { fresh_images } = await getFreshImages({ baseUrl, enc_collection_id });
      const { image_uid, orientation, enc_image_uid } = fresh_images[0];
      const imageUrl = templateImg(enc_image_uid, orientation);
      const freshData = {
        groupId: 'fresh',
        imageId: image_uid,
        count: fresh_images.length,
        enc_image_id: enc_image_uid,
        imageUrl,
        imageList: fresh_images.map(subItem => ({
          ...subItem,
          enc_image_id: subItem.enc_image_uid,
          image_id: subItem.enc_image_uid,
          name: subItem.group_name,
        })),
      };
      concatList.unshift(freshData);
      setGroupCollection(concatList);
      return Promise.resolve(concatList);
    }
    return Promise.resolve(lastestCount);
  };

  const getCommonList = async (concatList = groupCollection) => {
    setLoading(true);
    const data = await getAiGroupHeadList({ baseUrl, enc_collection_id });
    await getLastestList(concatList);
    let isExistedUnknowGroup = true;
    const groupList = data.group_infos.reduce((res, item) => {
      if (item && item.simple_image_info) {
        const {
          group_id,
          image_id,
          enc_image_id,
          image_infos,
          orientation = 1,
          face_rectangle,
          width,
          height,
          image_size,
          group_name,
          group_type,
        } = item.simple_image_info;
        let cutHead = null;

        if (group_id === '0' && !image_infos[0]) {
          isExistedUnknowGroup = false;
          return res;
        }

        let imageUrl = templateImg(enc_image_id, orientation);
        if (group_id === '0') {
          const { enc_image_id: firstImgId, orientation: firstOrientation } = image_infos[0];
          imageUrl = templateImg(firstImgId, firstOrientation);
        }
        if (face_rectangle) {
          const { x, y, width: targetW, height: targetH, position } = face_rectangle;
          // const [imageWidth, imageHeight] = calculateImgSide({ width, height, size: image_size });
          cutHead = {
            x,
            y,
            w: targetW,
            h: targetH,
            height,
            width,
            imgUrl: imageUrl,
            size: image_size,
            position,
          };
        }
        image_infos.forEach(item => (item.image_id = item.enc_image_id));
        res.push({
          groupId: group_id,
          imageId: image_id,
          count: image_infos.length,
          imageList: image_infos,
          enc_image_id,
          cutHead,
          // headPosition,
          imageUrl,
          name: group_name,
          group_type,
        });
      }
      return res;
    }, []);
    const newGroupList = concatList.concat(groupList);
    setLoading(false);
    setCurGroupId(
      isExistedUnknowGroup ? curGroupId || newGroupList[0].groupId : newGroupList[0].groupId
    );
    let tempAvatarName = newGroupList[0].group_name || '人物1';
    if (newGroupList[0].groupId === '0') {
      tempAvatarName = '合照';
    } else if (newGroupList[0].groupId === 'fresh') {
      tempAvatarName = '新增图片';
    }
    setCurrentAvatarName(curAvatarName || tempAvatarName);
    setGroupCollection(newGroupList);
  };

  const bindRelation = (item, curGroup) => {
    const { image_id, enc_image_id, orientation } = item;
    const { groupId } = curGroup;
    const imageUrl = templateImg(enc_image_id, orientation);
    setShowDrawer({
      show: true,
      selectedImgId: image_id,
      sourceGroupId: groupId,
      selectedImgUrl: imageUrl,
    });
  };

  const pushHeadImg = (key, value) => {
    cacheHead.current = {
      ...cacheHead.current,
      [key]: value,
    };
  };

  const unBindRelation = (item, curGroup) => {
    const { image_id: selectedImgId } = item;
    const { groupId: sourceGroupId } = curGroup;
    boundGlobalActions.showConfirm({
      close: boundGlobalActions.hideConfirm,
      message: '解除当前照片与人物的关联关系？',
      buttons: [
        {
          text: '取消',
          className: 'white',
          onClick: boundGlobalActions.hideConfirm,
        },
        {
          text: '确认',
          onClick: () => {
            reBindRelation(['0'], { selectedImgId, sourceGroupId, message: '人物已取消关联' });
          },
        },
      ],
    });
  };

  const reBindRelation = (targetGroupIds, info) => {
    const { selectedImgId, sourceGroupId, message } = info;
    const sourceGroupIds = [];
    groupCollection.forEach(item => {
      const tag = item.imageList.find(item => item.image_id === selectedImgId);
      tag && sourceGroupIds.push(item.groupId);
    });
    const isNotIncludeNewArr = targetGroupIds.filter(item => item.groupId !== 'new');
    const isIncludeNew = isNotIncludeNewArr.length !== targetGroupIds.length; //判断是否包含新头像
    const target_group_ids = targetGroupIds.length
      ? isNotIncludeNewArr.map(item => item.groupId)
      : ['0'];
    setLoading(true);
    const callback = newGroupid => {
      // 当存在新头像时 将设置的新头像groupid拼入target_group_ids
      const params = {
        enc_collection_id,
        group_image_remove_params: [
          {
            source_group_ids: sourceGroupIds,
            target_group_ids: newGroupid ? [...target_group_ids, newGroupid] : target_group_ids,
            image_ids: [selectedImgId],
          },
        ],
      };
      changeGroup({ baseUrl, params }).then(res => {
        getCommonList([]);
        closeDrawer();
        setLoading(false);
        boundGlobalActions.addNotification({
          message: message || '关联人物成功',
          level: 'success',
          autoDismiss: 2,
        });
      });
    };
    const updateAvatarParams = {
      group_id: null,
      group_name: null,
      enc_image_id: selectedImgId,
      group_type: 1, //当绑定新人物时为自定义 group_type为常量1（0-系统 1是自定义）
    };
    if (isIncludeNew) {
      updateAvatarFn(
        {
          baseUrl,
          params: { ...updateAvatarParams, enc_collection_id },
        },
        callback
      );
    } else {
      callback();
    }
  };

  const changeGroupId = (id, avatarName) => {
    setCurGroupId(id);
    setCurrentAvatarName(avatarName);
  };

  const closeDrawer = () => {
    setShowDrawer({ show: false, selectedImgId: '', sourceGroupId: '' });
  };
  const updateAvatar = (params, callBack, type) => {
    const apiName = type === 'name' ? updateAvatarNameFn : updateAvatarFn;
    apiName(
      {
        baseUrl,
        params: { ...params, enc_collection_id },
      },
      () => {
        callBack && callBack();
        getCommonList([]);
      }
    );
  };
  const curGroup = groupCollection.find(item => item.groupId === curGroupId);
  const leftProps = {
    closeModal,
    group: groupCollection,
    count: groupCollection.length,
    curGroupId,
    changeGroupId,
    updateAvatarName: (params, callBack) => updateAvatar(params, callBack, 'name'),
    enterType: EnterType[enterType],
    pushHeadImg,
  };

  const rightProps = {
    bindRelation,
    unBindRelation,
    templateImg,
    getLastestList,
    onSmartSharding,
    boundGlobalActions,
    group: groupCollection,
    showDrawer,
    collectionName,
    urls,
    curGroup: { ...curGroup, curAvatarName },
    updateAvatar: updateAvatar,
    boundProjectActions: props.boundProjectActions,
    enc_collection_id,
    enterType: EnterType[enterType],
  };

  return (
    <XModal className="ai_groups_modal" isHideIcon opened onClosed={closeModal}>
      <XLoading
        className="listLoading"
        type="listLoading"
        isShown={loading}
        backgroundColor="rgba(255,255,255,0.5)"
      />
      <div className="ai_groups_modal_content">
        <div className="leftContent">
          <GroupList {...leftProps} />
        </div>
        <div className="rightContent">
          <PhotosInGroupList {...rightProps} />
        </div>
      </div>
      {showDrawer.show && (
        <RelateToPersonDrawer
          activityType="bind"
          drawerList={groupCollection.filter(
            item => item.groupId !== '0' && item.groupId !== 'fresh'
          )}
          showDrawer={showDrawer}
          cacheHead={cacheHead.current}
          onOk={params => reBindRelation(params, showDrawer)}
          closeDrawer={closeDrawer}
        />
      )}
    </XModal>
  );
};

export default AIGroupsModal;
