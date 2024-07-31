import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getImageUrl } from '@apps/live-photo-client/utils/helper';
import IconLeft from '@apps/live/components/Icons/IconLeft';

import Banner from './Banner';
import { Container } from './layout';

const animationList = ['left', 'right', 'bottom', 'top', 'moveRotateScate', 'moveRotateTop'];

export default React.memo(BannerBox);
function BannerBox(props) {
  const {
    baseUrl,
    point,
    onChange,
    photoList,
    isAutoPlay,
    bannerBoxChange,
    isShowArrows = true,
    imageStyle,
  } = props;
  const timeId = useRef(null);
  const isPlay = useRef(false);
  const animationType = useRef(null);

  useEffect(() => {
    if (isAutoPlay) {
      isPlay.current = true;
      playAuto();
      return;
    }
    clearTimeout(timeId.current);
    isPlay.current = false;
    return () => {
      clearTimeout(timeId.current);
      isPlay.current = false;
    };
  }, [isAutoPlay]);

  function moveto(type) {
    let index = 0,
      sourceIndex = 0;
    const len = photoList.length - 1;
    const photoIndex = photoList.findIndex(
      photo => point.show_enc_content_id === photo.show_enc_content_id
    );
    if (type === 'left') {
      sourceIndex = photoIndex - 1;
    } else if (type === 'right') {
      sourceIndex = photoIndex + 1;
    }
    if (sourceIndex <= 0) {
      index = 0;
    } else if (sourceIndex <= len) {
      index = sourceIndex;
    } else {
      index = len;
    }

    animationType.current = type;
    const newPoint = photoList[index];
    onChange && onChange(newPoint);
  }

  // 自动播放
  function playAuto() {
    if (timeId.current) return;
    nextItem();
  }

  // 切换函数
  function nextItem() {
    const len = photoList.length - 1;
    let index = photoList.findIndex(
      photo => point.show_enc_content_id === photo.show_enc_content_id
    );
    index += 1;
    if (index > len) {
      index = 0;
    }
    bannerBoxChange && bannerBoxChange(photoList[index]);
  }

  // 判断选中banner
  function hasCheckBanner(source, target) {
    if (source.show_enc_content_id === target.show_enc_content_id) {
      return true;
    }
    return false;
  }

  // 设置动画
  function getAnimationType() {
    if (isAutoPlay) {
      const len = animationList.length;
      const index = Math.floor(Math.random() * len);
      return animationList[index];
    }
    return animationType.current;
  }

  function onAnimationEnd() {
    // console.log('isAutoPlay', isAutoPlay);
    if (!isAutoPlay || timeId.current) return;
    timeId.current = setTimeout(() => {
      clearTimeout(timeId.current);
      timeId.current = null;
      playAuto();
    }, 3000);
  }

  const bannerList = useMemo(() => {
    const pointIndex = photoList.findIndex(
      photo => point.show_enc_content_id === photo.show_enc_content_id
    );
    return photoList.map((photo, index) => {
      return (
        <Banner
          target={photo.imgUrl}
          source={photo.masterUrl}
          show={hasCheckBanner(photo, point)}
          animationType={getAnimationType()}
          key={photo.show_enc_content_id}
          pointIndex={pointIndex}
          index={index}
          onAnimationEnd={onAnimationEnd}
        ></Banner>
      );
    });
  }, [photoList, isAutoPlay, point]);

  // 计算左右箭头禁用样式
  const isDisabled = useMemo(() => {
    let index = photoList.findIndex(
      photo => point.show_enc_content_id === photo.show_enc_content_id
    );
    if (index === 0) {
      return 'left';
    } else if (index === photoList.length - 1) {
      return 'right';
    }
    return null;
  }, [point]);
  return (
    <Container>
      <div className="box" style={imageStyle}>
        {bannerList}
      </div>
      {isShowArrows ? (
        <span
          className={`left ${isDisabled === 'left' ? 'disabled' : ''}`}
          onClick={() => moveto('left')}
        >
          <IconLeft width={40} fill={isDisabled === 'left' ? '#ccc' : undefined} />
        </span>
      ) : null}
      {isShowArrows ? (
        <span
          className={`right ${isDisabled === 'right' ? 'disabled' : ''}`}
          onClick={() => moveto('right')}
        >
          <IconLeft width={40} fill={isDisabled === 'right' ? '#ccc' : undefined} />
        </span>
      ) : null}
    </Container>
  );
}
