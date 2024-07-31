import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getImageUrl } from '@apps/live-photo-client/utils/helper';
import IconLeft from '@apps/live/components/Icons/IconLeft';

import Banner from './Banner';
import { Container } from './layout';

const animationList = ['left', 'right', 'bottom', 'top', 'moveRotateScate', 'moveRotateTop'];
const animationListCn = ['top', 'left', 'right', 'moveOpacity', 'moveRotateTop'];

const maxLoadNum = 51;
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
    className,
    operatorState,
    handleAutoUpdateImage,
  } = props;
  const timeId = useRef(null);
  const animationType = useRef(null);
  const [ids, setIds] = useState([]);
  const [count, setCount] = useState(1);

  // console.log('photoList', photoList);
  const { animationType: animationTypeState, played, playType, time } = operatorState;

  useEffect(() => {
    if (played && isAutoPlay) {
      playAuto();
      return;
    }
  }, [isAutoPlay, played]);

  useEffect(() => {
    if (timeId.current) {
      clearTimeout(timeId.current);
      timeId.current = null;
    }
  }, [point]);

  useEffect(() => {
    if (timeId.current && !played) {
      clearTimeout(timeId.current);
      timeId.current = null;
    }
    return () => {
      clearTimeout(timeId.current);
      timeId.current = null;
    };
  }, [played]);

  useEffect(() => {
    if (count === 50) {
      handleAutoUpdateImage();
    }
  }, [count]);

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
    setCount(c => {
      c = (c + 1) % maxLoadNum;
      return c;
    });
    nextItem();
  }

  // 切换函数
  function nextItem() {
    const index = getIndex();
    bannerBoxChange && bannerBoxChange(photoList[index]);
  }

  function getIndex() {
    const len = photoList.length;
    let index = photoList.findIndex(
      photo => point.show_enc_content_id === photo.show_enc_content_id
    );
    if (isAutoPlay) {
      if (playType === 1) {
        if (ids.length === 0) {
          const first = getRandom(len);
          ids.push(first);
          const second = getRandom(len, first);
          ids.push(second);
          const third = getRandom(len, second);
          ids.push(third);
          const fourth = getRandom(len, third);
          ids.push(fourth);
        } else if (ids.length === len) {
          ids.shift();
          ids.push(getRandom(len, index));
        } else {
          ids.push(getRandom(len, index));
        }
        index = ids[ids.length - 4];
        setIds([...ids]);
      } else if (playType === 2) {
        index += 1;
      }
    }
    index %= len;
    return index;
  }

  // 获取随机数
  function getRandom(max, value) {
    const num = ~~(Math.random() * max);
    if (value !== num || !value) return num;
    return getRandom(max, value);
  }

  function getTime() {
    if (!__isCN__) return 3000;
    switch (time) {
      case 1:
        return 5000;
      case 2:
        return 10000;
      case 3:
        return 15000;
      default:
        return 5000;
    }
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
      const len = animationListCn.length;
      const index = Math.floor(Math.random() * len);
      console.log('animationTypeState', animationTypeState);
      return animationListCn[animationTypeState === 1 ? index : animationTypeState - 2];
    }
    return animationType.current;
  }

  function onAnimationEnd(e, type, cb) {
    // console.log('isAutoPlay', isAutoPlay);
    if (!isAutoPlay || timeId.current || !played) return;
    if (type === 1) {
      const t = getTime();
      timeId.current = setTimeout(() => {
        clearTimeout(timeId.current);
        timeId.current = null;
        cb?.();
      }, t);
    } else if (type === 2) {
      playAuto();
    }
  }

  // 预加载数组
  const loadList = useMemo(() => {
    let list = ids;
    if (ids.length >= 4) {
      list = ids.slice(ids.length - 4);
    }
    return list;
  }, [ids]);

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
          maxNum={photoList.length}
          onAnimationEnd={onAnimationEnd}
          loadList={playType === 1 && isAutoPlay ? loadList : undefined}
        ></Banner>
      );
    });
  }, [photoList, isAutoPlay, point, loadList, playType]);

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
  }, [point, photoList]);
  return (
    <Container className={className}>
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
