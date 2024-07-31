import { fromJS } from 'immutable';
import React, { Component, memo, useEffect, useRef, useState } from 'react';

import Select from '@resource/components/XSelect';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import scrollLoadHOC from '@common/utils/scrollLoadHOC';

import { XModal } from '@common/components';

import { querySetImages } from '@apps/gallery-client-mobile/services/project';
import { transformSetImages } from '@apps/gallery-client-mobile/utils/mapStateHelper';

import closePng from './close.png';
import selectPng from './select.png';

import './index.scss';

const ChooseImgModal = props => {
  const {
    urls,
    onOk,
    sets,
    close,
    boundGlobalActions,
    goEditor,
    scrollData,
    singleImg,
    beforeInEditor,
    boundProjectActions,
    updateData = () => {},
    postData = () => {},
    rack_sku_id,
    rack_id,
    store_id,
    collectionId,
  } = props;
  const [setsList, setSetsList] = useState(sets);
  const [selectedData, setSelectedData] = useState([]);
  const [setsWithImageList, setSetsWithImageList] = useState([]);
  const [curSet, setCurSet] = useState('all');
  const [shake, setShake] = useState(false);
  const boxRef = useRef(null);
  const limitClick = useRef(true);

  const curImages =
    setsWithImageList.length > 0 &&
    setsWithImageList.find(item => item.set_uid === curSet)?.['images'];
  const handleClose = () => {
    close();
  };

  useEffect(() => {
    if (curImages && curImages.length) {
      calculateBoxSize();
    }
  }, [curImages && curImages.length]);

  const calculateBoxSize = () => {
    const height = window.innerHeight;
    boxRef.current.style.height = `${height - 270}px`;
  };

  const goShopCart = () => {
    if (!limitClick.current) {
      return;
    }
    if (!selectedData.length) {
      return;
    }
    limitClick.current = false;
    if (beforeInEditor) {
      boundProjectActions.saveImgs(selectedData);
      onOk();
      return;
    }
    boundGlobalActions.showGlobalLoading();
    goEditor(() => {
      const options = initSaveParams();
      const allSelectedImgsNum =
        scrollData &&
        scrollData.toJS().filter(item => {
          const isSelected = selectedData.find(s => s.enc_image_uid === item.enc_image_uid);
          if (isSelected) {
            return true;
          }
          return false;
        }).length;
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
      const isSelected = selectedData.find(s => s.enc_image_uid === item.enc_image_uid);
      if (isSelected) {
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
      const data = newSets.length > 0 && newSets.find(item => item.set_uid === curSet)?.['images'];
      postData(fromJS(data));
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

  // useEffect(() => {
  //   if (rack_sku_id) {
  //     boundProjectActions.createVirtualProject({ rack_id, store_id, collectionId, rack_sku_id });
  //   }
  // }, [rack_sku_id, rack_id, store_id, rack_sku_id]);

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
    const currentImgs =
      setsWithImageList.length > 0 &&
      setsWithImageList.find(item => item.set_uid === val)?.['images'];
    postData(fromJS(currentImgs));
    setCurSet(val);
  };

  const selectImageEnv = data => {
    const { set_uid, enc_image_uid, selected } = data;
    const isFind = selectedData.find(item => item.enc_image_uid === enc_image_uid);
    let selectedList = selectedData;
    if (singleImg) {
      if (isFind) {
        selectedList = [];
      } else {
        selectedList = [data];
      }
    } else {
      if (isFind) {
        selectedList = selectedList.filter(item => item.enc_image_uid !== enc_image_uid);
      } else {
        selectedList = selectedList.concat({ ...data, enc_image_uid });
      }
    }
    setSelectedData(selectedList);
  };

  const allSelectedImgsNum = selectedData.length;

  return (
    <XModal
      className="choose_img_modal_mobile_product"
      opened
      onClosed={close}
      escapeClose={false}
      isHideIcon={true}
    >
      <div className="header_wrapper">
        <div className="left_wrapper">
          <img className="close" src={closePng} onClick={handleClose} />
          <Select
            options={setsList}
            isOpen={true}
            value={curSet}
            onChange={v => {
              changeSelect(v.value);
            }}
          />
        </div>
        <div className="right">
          {
            <div className={shake ? 'select_tips shake' : 'select_tips'}>
              {__isCN__
                ? `已选${allSelectedImgsNum}张图片`
                : `${allSelectedImgsNum} photo(s) selected`}
            </div>
          }
        </div>
      </div>
      {curImages.length > 0 ? (
        <div className="select_wrap clearfix" id="choose_imgs_modal" ref={boxRef}>
          <div id="scroll_content">
            {scrollData &&
              scrollData.toJS().map(item => {
                const isSelected = selectedData.find(s => s.enc_image_uid === item.enc_image_uid);
                return (
                  <div
                    className={isSelected ? 'image_wrap select' : 'image_wrap'}
                    key={item.enc_image_uid}
                    onClick={() => {
                      selectImageEnv(item);
                    }}
                  >
                    {isSelected && <img className="icon" src={selectPng} />}
                    <img className="product_img" src={item.src} />
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="no_photo">{__isCN__ ? '没有图片' : 'No Photos'}</div>
      )}
      <div
        className={`buttonWrapper ${!selectedData.length ? 'disabled' : ''}`}
        onClick={goShopCart}
      >
        <div className="btn">{__isCN__ ? '继续' : 'Next'}</div>
      </div>
    </XModal>
  );
};

const MemoChooseImgModal = memo(ChooseImgModal);

class WrapperComp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <MemoChooseImgModal {...this.props} />;
  }
}

export default scrollLoadHOC(WrapperComp, {
  scrollContainerId: 'choose_imgs_modal',
  scrollContentIds: ['scroll_content'],
});
