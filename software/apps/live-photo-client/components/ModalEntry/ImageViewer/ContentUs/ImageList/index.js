import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getImageUrl } from '@apps/live-photo-client/utils/helper';
import IconLeft from '@apps/live/components/Icons/IconLeft';

import { Container, PointerLeft, PointerRight } from './layout';

const boxW = 135;
export default function ImageList(props) {
  const [moveX, setMoveX] = useState(0);
  const { photoList, baseUrl, onChange, point, className } = props;
  const urlMap = useRef({});

  const listRef = useRef(null);

  useEffect(() => {
    autoMove();
  }, [point]);

  // 左右移动点击事件
  function moveClick(type) {
    const { width } = listRef.current.getBoundingClientRect();
    if (type === 'left') {
      move(moveX + width / 2);
    } else if (type === 'right') {
      move(moveX - width / 2);
    }
  }

  // 移动函数
  function move(w) {
    const { width } = listRef.current.getBoundingClientRect();
    let num = 0;
    const count = photoList.length;
    const maxWidth = -count * boxW + width;
    if (w < 0) {
      num = Math.max(w, maxWidth);
    } else if (w > 0) {
      num = 0;
    }
    // console.log('x', num, w);
    setMoveX(num);
  }

  // 判断是否被选中
  function hasPoint(source, target) {
    if (source.show_enc_content_id !== target.show_enc_content_id) {
      return false;
    }
    return true;
  }
  // 选中事件
  function itemClick(photo, index) {
    onChange && onChange(photo, index);
  }

  // 选中自动计算移动距离
  function autoMove() {
    const index = photoList.findIndex(
      photo => photo.show_enc_content_id === point.show_enc_content_id
    );
    const { width } = listRef.current.getBoundingClientRect();
    const b = -boxW,
      r = width >> 1;
    const x = index * b + r;
    move(x);
  }

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

  const listStyle = {
    transform: `translateX(${moveX}px)`,
  };

  // 列表懒加载
  function getUrl(n, sourceUrl) {
    const index = photoList.findIndex(
      photo => photo.show_enc_content_id === point.show_enc_content_id
    );
    const max = index + 15;
    // 默认上来加载15张
    if (n <= max && n >= index) {
      urlMap.current[n] = sourceUrl;
    }

    if (urlMap.current[n]) {
      return urlMap.current[n];
    }

    if (!listRef.current) return '';
    const { width } = listRef.current.getBoundingClientRect();
    const boxW = 120 + 15;
    const offsetWidth = boxW * n;
    const x = Math.abs(moveX);
    if (x - boxW <= offsetWidth && offsetWidth - x <= width) {
      urlMap.current[n] = sourceUrl;
      return sourceUrl;
    }
    return '';
  }

  return (
    <Container className={className}>
      <PointerLeft
        onClick={() => moveClick('left')}
        className={`${isDisabled === 'left' ? 'disabled' : ''}`}
      >
        <IconLeft fill={isDisabled === 'left' ? '#ccc' : undefined} />
      </PointerLeft>
      <div className="image-box">
        <ul ref={listRef} className="image-list" style={listStyle}>
          {photoList.map((photo, index) => {
            return (
              <li
                className={`review-item ${hasPoint(point, photo) ? 'current' : ''}`}
                key={photo.show_enc_content_id}
                style={{
                  backgroundImage: `url(${getUrl(index, photo.imgUrl)})`,
                }}
                onClick={() => itemClick(photo, index)}
              ></li>
            );
          })}
        </ul>
      </div>
      <PointerRight
        onClick={() => moveClick('right')}
        className={`${isDisabled === 'right' ? 'disabled' : ''}`}
      >
        <IconLeft fill={isDisabled === 'right' ? '#ccc' : undefined} />
      </PointerRight>
    </Container>
  );
}
