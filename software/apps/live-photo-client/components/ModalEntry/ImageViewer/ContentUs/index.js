import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'swiper/swiper-bundle.css';

import { LIVE_PHOTO_VERIFY_NO_WATERMARK } from '@common/constants/strings';

import { useSetting } from '@apps/live-photo-client/constants/context';

import BannerBox from './BannerBox';
import ControlList from './ControlList';
import ImageList from './ImageList';
import { Container } from './layout';

export default function Content(props) {
  const {
    photoList,
    baseUrl,
    index = 0,
    initalShowImageList = true,
    initalShowControlList = true,
    initalAutoPlay = false,
    logClick,
  } = props;
  const { watermark } = useSetting();
  const [point, setPoint] = useState(photoList[index] || {});
  const [isShowImageList, setIsShowImageList] = useState(initalShowImageList);
  const [isShowControlList, setIsShowControlList] = useState(initalShowControlList);
  const [isAutoPlay, setIsAutoPlay] = useState(initalAutoPlay);

  function onChange(photo) {
    setPoint(photo);
    // setIsAutoPlay(false);
  }
  function bannerBoxChange(photo) {
    setPoint(photo);
  }

  useEffect(() => {
    if (watermark !== LIVE_PHOTO_VERIFY_NO_WATERMARK) {
      // 图片查看埋点
      logClick && logClick(point.show_enc_content_id, '2');
    }

    // console.log('point', point);
  }, [point]);

  function handleList() {
    setIsShowImageList(state => !state);
  }

  function handleAotoPlay() {
    setIsAutoPlay(state => !state);
    setIsShowImageList(false);
    setIsShowControlList(false);
  }

  const imageStyle = useMemo(() => {
    if (!isAutoPlay) return;
    return { width: '100%' };
  }, [isAutoPlay]);

  return (
    <Container>
      <BannerBox
        imageStyle={imageStyle}
        baseUrl={baseUrl}
        point={point}
        bannerBoxChange={bannerBoxChange}
        onChange={onChange}
        photoList={photoList}
        isAutoPlay={isAutoPlay}
        isShowArrows={!isAutoPlay}
      />
      <ControlList
        handleList={handleList}
        point={point}
        handleAotoPlay={handleAotoPlay}
        isShowImageList={isShowImageList}
        className={isShowControlList ? '' : 'hidden'}
        baseUrl={baseUrl}
      />
      <ImageList
        photoList={photoList}
        baseUrl={baseUrl}
        index={index}
        point={point}
        onChange={onChange}
        className={isShowImageList ? '' : 'hidden'}
      />
    </Container>
  );
}
