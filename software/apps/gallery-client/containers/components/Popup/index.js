import React, { memo, useEffect, useMemo, useState } from 'react';
import LazyLoad from 'react-lazy-load';

import { getImageUrl as getImg } from '@resource/lib/saas/image';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import getTargetPositionImg, { getRelativePositionImg } from '@common/utils/targetPositionFromImg';

import { XImg } from '@common/components';

import { getImageUrl } from './main';

import './index.scss';

const getImgSrc = (item, galleryBaseUrl) => {
  const {
    enc_image_id,
    face_rectangle = {},
    height,
    width,
    image_size,
    image_infos = [],
    group_id,
    orientation,
  } = item.simple_image_info;
  const uid = enc_image_id ? enc_image_id : (image_infos || [{}])[0].enc_image_id;
  const getHeadImg =
    face_rectangle?.position === 'relative' ? getRelativePositionImg : getTargetPositionImg;
  const src = enc_image_id
    ? getImageUrl({
        galleryBaseUrl,
        image_uid: uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_1000,
        timestamp: enc_image_id ? uid : new Date().getTime(),
        orientation,
      })
    : getImg({
        galleryBaseUrl,
        image_uid: uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_1000,
        timestamp: enc_image_id ? uid : new Date().getTime(),
      });
  return face_rectangle
    ? getHeadImg({
        x: face_rectangle.x,
        y: face_rectangle.y,
        w: face_rectangle.width,
        h: face_rectangle.height,
        width,
        height,
        size: image_size,
        imgUrl: src,
        areaW: 60,
        areaH: 60,
      })
    : Promise.resolve(src);
};
const ImgBox = memo(props => {
  const { item } = props;
  const [url, setUrl] = useState('');
  useEffect(() => {
    getImgSrc(props.item, props.galleryBaseUrl).then(res => {
      setUrl(res);
    });
  }, []);
  return (
    <LazyLoad
      className="lazyload-container"
      offset={100}
      once
      key={`lazyload-item-${item.simple_image_info.group_id}`}
    >
      <div className="loadingBox">
        {/* <XImg src={url} type="background" /> */}
        <img src={url} alt="" />
        {!item.simple_image_info.group_id && <div className="mask">合照</div>}
      </div>
    </LazyLoad>
  );
});
const Popup = props => {
  const { guest_uid, galleryBaseUrl } = props;
  const [list, setList] = useState(
    props.faceImgs.filter(
      item => item.simple_image_info.image_infos && item.simple_image_info.image_infos.length > 0
    ) || []
  );
  const [style, setStyle] = useState({});
  const onPicker = index => {
    list[index].tag = !list[index].tag;
    setList([...list]);
  };
  const onconfirm = () => {
    const filter = list.filter(item => item.tag);
    props.onFaceSelect(filter);
    // 将选择存入缓存
    localStorage.setItem(
      guest_uid,
      JSON.stringify(filter.map(item => item.simple_image_info.group_id))
    );
  };
  const onClear = () => {
    list.forEach(item => (item.tag = false));
    setList([...list]);
  };
  useEffect(() => {
    setStyle({ left: 0 });
    //获取选择缓存
    const selectCache =
      localStorage.getItem(guest_uid) && JSON.parse(localStorage.getItem(guest_uid));
    (selectCache || []).forEach(item => {
      list.some(itm => {
        if (itm.simple_image_info.group_id === item) {
          itm.tag = true;
          return true;
        }
      });
    });
    setList([...list]);
  }, []);
  const selectLength = list.filter(item => item.tag).length;
  const nameTag = list.some(item => !!item.simple_image_info.group_name);
  return (
    <div className="Popup" style={style}>
      <div className="title">按人像搜索</div>
      <div className="imgList">
        {list.map((item, index) => (
          <div>
            <div
              className={item.tag ? 'imgBox active' : 'imgBox'}
              key={index}
              onClick={() => onPicker(index)}
            >
              <ImgBox item={item} galleryBaseUrl={galleryBaseUrl} />
            </div>
            {nameTag && !!item.simple_image_info.group_id && (
              <div className="avatarName">
                {item.simple_image_info.group_name || `人物${index + 1}`}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bottom">
        <div>已选：{selectLength}</div>
        <div className="cancle" onClick={onClear}>
          清空选中
        </div>
        <div className="confirm" onClick={onconfirm}>
          确定
        </div>
      </div>
    </div>
  );
};

export default memo(Popup);
