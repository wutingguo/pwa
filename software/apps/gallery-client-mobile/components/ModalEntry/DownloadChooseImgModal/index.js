import classNames from 'classnames';
import { fromJS } from 'immutable';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import Select from '@resource/components/XSelect';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import { stopScrollEffect } from '@resource/tools/hooksEnhance';

import { XButton, XIcon, XModal } from '@common/components';

import { querySetImages } from '@apps/gallery-client/services/project';
import { transformSetImages } from '@apps/gallery-client/utils/mapStateHelper';

import closePng from './close.png';
import selectPng from './select.png';

import './index.scss';

const ChooseImgModal = props => {
  const {
    data,
    urls,
    collectionId,
    onOk,
    sets,
    close,
    boundGlobalActions,
    downloadPhoto,
    downloadSetting,
    downloadImgInfo,
  } = props;
  const [setsList, setSetsList] = useState(sets);
  const [setsWithImageList, setSetsWithImageList] = useState([]);
  const [curSet, setCurSet] = useState(sets.find(item => item.download_status)?.set_uid);
  const [curSetImages, setCurSetImages] = useState([]);
  const [shake, setShake] = useState(false);
  const [chooseNewImg, setChooseNewImg] = useState(0);
  const galleryBaseUrl = urls['galleryBaseUrl'];
  const limitClick = useRef(true);
  const [isOpen, setIsOpen] = useState(false);
  const { limited_num, remaining, sets: downloadSets } = downloadImgInfo;

  const handleClose = () => {
    close && close();
  };
  const goDownload = debounce(() => {
    // if (!limitClick.current) {
    //   return;
    // }
    // limitClick.current = false;
    const downloadImgListImg = initSaveParams();
    console.log(downloadImgListImg, 'downloadImgListImg');
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
    onOk(downloadImgListImg, callBack);
  }, 1000);
  const initSaveParams = () => {
    const allSetsMap = setsWithImageList.find(set => set.set_uid === 'all');
    const selected_item_list = [];
    allSetsMap.images.forEach(item => {
      if (item.selected) {
        selected_item_list.push(item.enc_image_uid);
      }
    });
    return selected_item_list;
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

  const getSetsWithImageMap = async () => {
    const promiseArr = [];
    sets.forEach(set => {
      const { set_uid, set_name } = set;
      const images = getImageList(set_uid, set_name);
      promiseArr.push(images);
    });
    Promise.all(promiseArr).then(res => {
      const newSets = getAllSetWidthImages(res);
      setSetsWithImageList(newSets);
    });
  };
  useEffect(() => {
    let initSets = setsList.map(item => {
      return {
        value: item.set_uid,
        label: item.set_name,
        isDisabled: !item.download_status,
        className: !item.download_status ? 'disabled' : '',
      };
    });
    setSetsList(initSets);
    getSetsWithImageMap();
    stopScrollEffect(true);
    return () => {
      stopScrollEffect(false);
    };
  }, []);
  // useEffect(() => {
  //   getSetsWithImageMap();
  // }, [curSet]);

  // 获取图片列表
  const getImageList = async (id, name) => {
    const galleryBaseUrl = urls['galleryBaseUrl'];
    const params = {
      baseUrl: galleryBaseUrl,
      set_uid: id,
    };

    const res = await querySetImages(params);
    let imageList = [];
    const data = transformSetImages(fromJS({ images: res }), null, fromJS(urls)).toJS();
    downloadSets &&
      downloadSets.forEach(set => {
        if (set.set_id === id) {
          const List = data.map(item => {
            set.enc_image_ids.forEach(enc_image_uid => {
              if (enc_image_uid === item.enc_image_uid) {
                item.isDownload = true;
              }
            });

            return Object.assign(item, {
              width: item.width,
              height: item.height,
              set_uid: id,
              set_name: name,
              selected: false,
            });
          });
          imageList.push(...List);
        }
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
  const changeSelect = v => {
    if (v.isDisabled) {
      boundGlobalActions.addNotification({
        message: 'The set has been made unavailable for download.',
        level: 'error',
        autoDismiss: 2,
      });
      return;
    }
    setCurSet(v.value);
  };
  const selectImageEnv = item => {
    const { set_uid, isDownload } = item;
    const setsMap = setsWithImageList.map(sets => {
      if (set_uid === sets.set_uid) {
        const { images } = sets;
        const selectedImages = images.filter(item => item.selected);
        if (
          (selectedImages.length >= limited_num || remaining <= chooseNewImg) &&
          !item.selected &&
          !isDownload
        ) {
          boundGlobalActions.addNotification({
            message: 'No photos remaining for download.',
            level: 'error',
            autoDismiss: 2,
          });
          return {
            ...sets,
            images,
          };
        }
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
    newSets.forEach(sets => {
      if (sets.set_uid === 'all') {
        const { images } = sets;
        const selected = images.filter(item => item.selected);
        const selectedOldImg = images.filter(item => item.isDownload && item.selected);
        const selectedNewImg = selected.length - selectedOldImg.length;
        setChooseNewImg(selectedNewImg);
      }
    });
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
      className="download_choose_img_modal"
      opened
      onClosed={close}
      escapeClose={false}
      isHideIcon={true}
    >
      <div className="choose-img-header">
        <img className="close" src={closePng} onClick={handleClose} />
        <div className="title">
          {t('SELECT_PHOTO')}
          <div className="download-select">
            {remaining} / {limited_num} photos remaining for download.
          </div>
        </div>
      </div>
      {curImages.length > 0 ? (
        <div className="select_wrap clearfix">
          {curImages &&
            curImages.map(item => {
              return (
                <div
                  className={classNames('image_wrap', {
                    select: item.selected,
                    downloaded: item.isDownload,
                  })}
                  onClick={() => {
                    selectImageEnv(item);
                  }}
                >
                  {item.selected && <img className="icon" src={selectPng} />}
                  <img className="product_img" src={item.src} />
                  {item.isDownload && (
                    <XIcon
                      type="download-small"
                      className="download_icon"
                      title={
                        'Re-downloadinng this photo will not be counted for the download limit.'
                      }
                    />
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        <div className="no_photo">{__isCN__ ? '没有图片' : 'No Photos'}</div>
      )}
      <div className="choose-img-footer">
        <Select
          options={setsList}
          value={curSet}
          menuContainerStyle={{ top: `${setsList.length * -100}%` }}
          className="choose-img-select"
          onChange={v => {
            changeSelect(v);
          }}
        />

        <div className="right">
          <div className={allSelectedImgsNum ? 'button' : `button disabled`} onClick={goDownload}>
            {__isCN__ ? '继续' : 'Next'}
          </div>

          <div className={shake ? 'select_tips shake' : 'select_tips'}>
            {`${chooseNewImg} new photo(s) selected`}
          </div>
        </div>
      </div>
    </XModal>
  );
};

export default memo(ChooseImgModal);
