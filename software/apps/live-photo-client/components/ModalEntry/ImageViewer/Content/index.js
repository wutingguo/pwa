import cls from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'swiper/swiper-bundle.css';

import { LIVE_PHOTO_VERIFY_NO_WATERMARK } from '@common/constants/strings';

import { useSetting } from '@apps/live-photo-client/constants/context';

import BannerBox from './BannerBox';
import ControlList from './ControlList';
import ImageList from './ImageList';
import OperatorLine from './OperatorLine';
import { Container } from './layout';

export default function Content(props) {
  const {
    photoList: defaultPhotoList = [],
    baseUrl,
    index = 0,
    initalShowImageList = true,
    initalShowControlList = true,
    initalAutoPlay = false,
    logClick,
    handleAutoUpdateImage,
    autoUpdate,
  } = props;
  const { watermark } = useSetting();
  const [point, setPoint] = useState(defaultPhotoList[index] || {});
  const [isShowImageList, setIsShowImageList] = useState(initalShowImageList);
  const [isShowControlList, setIsShowControlList] = useState(initalShowControlList);
  const [bottomListVisible, setBottomListVisible] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(initalAutoPlay);
  const [photoList, setPhotoList] = useState(defaultPhotoList);
  const [operatorState, setOperatorState] = useState({
    time: 1,
    playType: 1,
    animationType: 1,
    played: true,
  });

  const imageTimer = useRef(null);

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

  useEffect(() => {
    if (!autoUpdate) return;
    let cancel = null;
    if (isAutoPlay) {
      cancel = handleAutoUpdateImage(updatePhotoList);
    } else {
      cancel?.();
    }
    return () => {
      cancel?.();
    };
  }, [isAutoPlay, autoUpdate]);

  function updatePhotoList(list) {
    setPhotoList([...list]);
  }

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

  function operatorChange(key, value) {
    if (key === 'showImageList') {
      setIsShowImageList(value);
      return;
    }

    setOperatorState(state => ({
      ...state,
      [key]: value,
    }));
  }

  function handleMouseMove() {
    if (!isAutoPlay) return;
    setBottomListVisible(true);
    autoHideImageList();
  }

  // 底部操作自动显示影藏控制
  function autoHideImageList() {
    if (imageTimer.current) {
      clearTimeout(imageTimer.current);
      imageTimer.current = null;
    }
    imageTimer.current = setTimeout(() => {
      setBottomListVisible(false);
    }, 10000);
  }

  return (
    <Container onMouseMove={handleMouseMove}>
      <BannerBox
        imageStyle={imageStyle}
        baseUrl={baseUrl}
        point={point}
        bannerBoxChange={bannerBoxChange}
        onChange={onChange}
        photoList={photoList}
        isAutoPlay={isAutoPlay}
        isShowArrows={!isAutoPlay}
        className={cls({
          dark: isAutoPlay,
        })}
        operatorState={operatorState}
        handleAutoUpdateImage={() => handleAutoUpdateImage(updatePhotoList, false)}
      />
      <ControlList
        handleList={handleList}
        point={point}
        handleAotoPlay={handleAotoPlay}
        isShowImageList={isShowImageList}
        className={isShowControlList ? '' : 'hidden'}
        baseUrl={baseUrl}
      />
      <div
        style={isAutoPlay ? { position: 'absolute', width: '100%', transition: 'bottom .3s' } : {}}
        className={cls({
          operator_line_hide: !bottomListVisible,
          operator_line_show: bottomListVisible,
        })}
      >
        <OperatorLine
          className={cls({ hidden: !isAutoPlay })}
          onChange={operatorChange}
          operatorState={{ ...operatorState, showImageList: isShowImageList }}
          style={{ marginBottom: !isShowImageList ? 20 : 0 }}
        />
        <ImageList
          photoList={photoList}
          baseUrl={baseUrl}
          point={point}
          onChange={onChange}
          className={cls({
            hidden: !isShowImageList,
            show: isShowImageList,
            dark: isAutoPlay,
          })}
        />
      </div>
    </Container>
  );
}
