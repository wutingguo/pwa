import { current } from 'immer';
import React, { useEffect, useState } from 'react';
import LazyLoad from 'react-lazy-load';

import getTargetPositionImg, { getRelativePositionImg } from '@common/utils/targetPositionFromImg';

import { XImg } from '@common/components';

const ItemSection = props => {
  const { imageUrl, cutHead, width, cacheHead, enc_image_id } = props;
  const [headImg, setHeadImg] = useState('');
  const key = `${enc_image_id}_${cutHead.position}_${cutHead.x}_${cutHead.y}`;

  useEffect(() => {
    calculateHead();
  }, []);

  const calculateHead = async () => {
    if (cacheHead[key]) {
      setHeadImg(cacheHead[key]);
      return;
    }
    if (cutHead) {
      const getHeadImg =
        cutHead.position === 'relative' ? getRelativePositionImg : getTargetPositionImg;
      const head = await getHeadImg({ ...cutHead, areaW: width, areaH: width });
      setHeadImg(head);
    } else {
      setHeadImg(imageUrl);
    }
  };
  return (
    <div className="head_person">
      <LazyLoad offset={300} className="lazyload-wrap">
        {/* <XImg
          src={headImg}
          type="background"
          propsStyle={headPosition ? { backgroundPosition: `${headPosition}` } : {}}
        /> */}
        <div className="imgBox">
          <XImg src={headImg} alt="" type={cacheHead[key] ? 'background' : ''} />
        </div>
      </LazyLoad>
    </div>
  );
};

export default ItemSection;
