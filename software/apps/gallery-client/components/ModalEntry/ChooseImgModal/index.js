import classNames from 'classnames';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import Select from '@resource/components/XSelect';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import { XButton, XModal } from '@common/components';

import { querySetImages } from '@apps/gallery-client/services/project';
import { transformSetImages } from '@apps/gallery-client/utils/mapStateHelper';

import closePng from './close.png';
import selectPng from './select.png';

import './index.scss';

const ChooseImgModal = props => {
  const {
    data,
    urls,
    rack_id,
    spuId,
    store_id,
    store_spu_id,
    collectionId,
    onOk,
    sets,
    close,
    boundGlobalActions,
    goEditor,
  } = props;
  const [setsList, setSetsList] = useState(sets);
  const [setsWithImageList, setSetsWithImageList] = useState([]);
  const [curSet, setCurSet] = useState('all');
  const [curSetImages, setCurSetImages] = useState([]);
  const [shake, setShake] = useState(false);
  const estoreBaseUrl = urls['estoreBaseUrl'];
  const limitClick = useRef(true);
  const handleClose = () => {
    close();
  };
  const goShopCart = () => {
    if (!limitClick.current) {
      return;
    }
    limitClick.current = false;
    goEditor(() => {
      const options = initSaveParams();
      const allImages =
        setsWithImageList.length > 0 &&
        setsWithImageList.find(item => item.set_uid === 'all')?.['images'];
      const allSelectedImgsNum = allImages && allImages.filter(item => item.selected).length;
      if (!allSelectedImgsNum) {
        setShake(true);
        const timer = setTimeout(() => {
          setShake(false);
          limitClick.current = true;
          clearTimeout(timer);
        }, 500);
        return;
      }
      const callBack = err => {
        const errMsg = err || 'system error';
        boundGlobalActions.addNotification({
          message: t(errMsg),
          level: 'error',
          autoDismiss: 2,
        });
      };
      onOk(options, callBack);
    });
  };
  const initSaveParams = () => {
    const { rack_id, spuId, store_id, store_spu_id, collectionId, curSkuItem } = props;
    const { sku_uuid, rack_sku_id } = curSkuItem;
    const allSetsMap = setsWithImageList.find(set => set.set_uid === 'all');
    const selected_item_list = [];
    allSetsMap.images.forEach(item => {
      if (item.selected) {
        selected_item_list.push({
          gallery_set_name: item.set_name,
          gallery_set_id: item.set_uid,
          image_Name: item.image_name + item.suffix,
          enc_image_id: item.enc_image_uid,
        });
      }
    });
    return {
      photo_selected_id: null,
      rack_id: rack_id,
      gallery_collection_id: collectionId,
      rack_spu_id: '',
      rack_sku_id: rack_sku_id,
      selected_item_list,
    };
  };
  const getAllSetWidthImages = setsMap => {
    const oriSetsMap = setsMap.filter(set => set.set_uid !== 'all');
    const allSetsImages = [];
    oriSetsMap.forEach(item => {
      allSetsImages.push(...item.images);
    });
    oriSetsMap.unshift({
      set_uid: 'all',
      set_name: 'All Photos',
      images: allSetsImages,
    });
    return oriSetsMap;
  };
  const getSetsWithImageMap = () => {
    const promiseArr = [];
    sets.forEach(set => {
      const { set_uid, set_name } = set;
      const images = getImageList(set_uid, set_name);
      promiseArr.push(images);
    });
    Promise.all(promiseArr).then(res => {
      console.log(res, '+++');
      const newSets = getAllSetWidthImages(res);
      setSetsWithImageList(newSets);
    });
  };
  useEffect(() => {
    let initSets = setsList.map(item => {
      return {
        value: item.set_uid,
        label: item.set_name,
      };
    });
    initSets.unshift({
      label: __isCN__ ? '所有照片' : 'All Photos',
      value: 'all',
    });
    setSetsList(initSets);
    getSetsWithImageMap();
  }, []);
  useEffect(() => {
    // getImageList(curSet);
  }, [curSet]);
  // 获取图片列表
  const getImageList = async (id, name) => {
    const galleryBaseUrl = urls['galleryBaseUrl'];
    const params = {
      baseUrl: galleryBaseUrl,
      set_uid: id,
    };

    const res = await querySetImages(params);
    const data = transformSetImages(fromJS({ images: res }), null, fromJS(urls)).toJS();
    const imageList = data.map(item => {
      return Object.assign(item, {
        width: item.width,
        height: item.height,
        set_uid: id,
        set_name: name,
        selected: false,
      });
    });
    const promiseArr = [];
    imageList.forEach(item => {
      const { orientation, src } = item;
      promiseArr.push(getOrientationAppliedImage(src, orientation));
    });
    await Promise.all(promiseArr).then(res => {
      imageList.forEach((item, index) => {
        imageList[index].src = res[index];
      });
    });
    return new Promise((resolve, reject) => {
      resolve({
        images: imageList,
        set_uid: id,
        set_name: name,
      });
    });
  };
  const changeSelect = val => {
    setCurSet(val);
  };
  const selectImageEnv = item => {
    const { set_uid } = item;
    const setsMap = setsWithImageList.map(sets => {
      if (set_uid === sets.set_uid) {
        const { images } = sets;
        const newImages = images.map(image => {
          return item.enc_image_uid === image.enc_image_uid
            ? Object.assign({}, image, { selected: !item.selected })
            : image;
        });
        return {
          ...sets,
          images: newImages,
        };
      }
      return sets;
    });
    const newSets = getAllSetWidthImages(setsMap);
    setSetsWithImageList(newSets);
  };
  const curImages =
    setsWithImageList.length > 0 &&
    setsWithImageList.find(item => item.set_uid === curSet)?.['images'];
  const allImages =
    setsWithImageList.length > 0 &&
    setsWithImageList.find(item => item.set_uid === 'all')?.['images'];
  const allSelectedImgsNum = allImages && allImages.filter(item => item.selected).length;

  return (
    <XModal
      className="choose_img_modal"
      opened
      onClosed={close}
      escapeClose={false}
      isHideIcon={true}
    >
      <img className="close" src={closePng} onClick={handleClose} />
      <Select
        options={setsList}
        value={curSet}
        onChange={v => {
          changeSelect(v.value);
        }}
      />
      <div className="right">
        <div className="button" onClick={goShopCart}>
          {__isCN__ ? '继续' : 'Next'}
        </div>
        {
          <div className={shake ? 'select_tips shake' : 'select_tips'}>
            {__isCN__
              ? `已选${allSelectedImgsNum}张图片`
              : `${allSelectedImgsNum} photo(s) selected`}
          </div>
        }
      </div>

      <div className="title">{t('SELECT_PHOTO')}</div>

      {curImages.length > 0 ? (
        <div className="select_wrap clearfix">
          {curImages &&
            curImages.map(item => {
              return (
                <div
                  className={item.selected ? 'image_wrap select' : 'image_wrap'}
                  onClick={() => {
                    selectImageEnv(item);
                  }}
                >
                  {item.selected && <img className="icon" src={selectPng} />}
                  <img className="product_img" src={item.src} />
                </div>
              );
            })}
        </div>
      ) : (
        <div className="no_photo">{__isCN__ ? '没有图片' : 'No Photos'}</div>
      )}
    </XModal>
  );
};

export default memo(ChooseImgModal);
