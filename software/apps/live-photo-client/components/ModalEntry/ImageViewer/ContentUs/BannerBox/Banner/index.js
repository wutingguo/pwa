import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Container } from './layout';

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
    size = 3,
    onAnimationEnd,
  } = props;
  // console.log('size', size);
  const flag = useRef(false);
  // useEffect(() => {
  //   let timeId = setTimeout(() => {
  //     setIsSourceShow(true);
  //     clearImmediate(timeId);
  //     timeId = null;
  //   }, 500);
  // }, []);

  useEffect(() => {
    setIsSourceShow();
  });
  function onLoad() {
    setIsSourceShow(true);
  }

  const isSetUrl = useMemo(() => {
    if (flag.current) return flag.current;
    if (pointIndex + size >= index && index >= pointIndex) {
      flag.current = true;
      return true;
    }
    return false;
  }, [pointIndex]);
  return (
    <Container
      animationType={animationType}
      style={{ display: show ? 'block' : 'none' }}
      onAnimationEnd={onAnimationEnd}
    >
      {isSourceShow ? null : (
        <img
          src={isSetUrl ? target : './images/loading.gif'}
          // src={target}
          className="target"
        />
      )}
      <img
        src={isSetUrl ? source : './images/loading.gif'}
        className="source"
        // style={{ zIndex: isSourceShow ? 3 : '' }}
        onLoad={onLoad}
      />

      {/* <div className="target" style={{ backgroundImage: `url(${target})` }}>
        <img
          src={source}
          className="source"
          style={{ zIndex: isSourceShow ? 3 : '' }}
        />
      </div> */}
    </Container>
  );
}
