import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Container } from './layout';

const animationOpt = {
  top: 'topMoveBottom',
  left: 'leftMoveRight',
  right: 'rightMoveLeft',
  moveOpacity: 'moveOpacityOut',
  moveRotateTop: 'moveRotateScateOut',
};
export default React.memo(Banner);
function Banner(props) {
  const [isSourceShow, setIsSourceShow] = useState(false);
  const {
    target,
    source,
    show,
    animationType,
    pointIndex,
    index,
    onAnimationEnd,
    maxNum,
    loadList,
  } = props;
  const [endName, setEndName] = useState('');
  const flag = useRef(false);

  useEffect(() => {
    setIsSourceShow();
  });
  function onLoad() {
    setIsSourceShow(true);
  }

  function handleAnimationEnd(e) {
    if (!__isCN__) {
      return onAnimationEnd(e);
    }
    if (endName) {
      onAnimationEnd?.(e, 2);
      setEndName('');
    } else {
      onAnimationEnd?.(e, 1, () => {
        setEndName(animationOpt[animationType] || 'topMoveBottom');
      });
    }
  }

  // console.log('loadList', loadList, pointIndex);
  const isSetUrl = useMemo(() => {
    if (flag.current) return flag.current;
    // 预加载
    const loads = loadList
      ? [...loadList, pointIndex]
      : [
          pointIndex,
          (pointIndex + 1) % maxNum,
          (pointIndex + 2) % maxNum,
          (pointIndex + 3) % maxNum,
        ];
    if (loads.includes(index)) {
      console.log('index', index);
      flag.current = true;
      return true;
    }
    return false;
  }, [pointIndex, maxNum, loadList, index]);
  return (
    <Container
      animationType={endName || animationType}
      style={{ display: show ? 'block' : 'none' }}
      onAnimationEnd={handleAnimationEnd}
    >
      {isSourceShow ? null : <img src={isSetUrl ? target : ''} className="target" />}
      <img src={isSetUrl ? source : ''} className="source" onLoad={onLoad} />
    </Container>
  );
}
