import { fromJS } from 'immutable';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import XButton from '@resource/components/XButton';

import { isOrientationExchange, isRotated } from '@resource/lib/utils/exif';

import './index.scss';

const H = ({ renderCard, list = fromJS([]), designSetting }) => {
  const [viewArr, setViewArr] = useState([]);
  const galleryStyle = designSetting.get('gallery').toJSON();
  const { grid_spacing, grid_style, thumbnail_size } = galleryStyle;
  const minHeight = (thumbnail_size || '').toLowerCase() === 'large' ? 300 : 254;
  const gapWidth = (grid_spacing || '').toLowerCase() === 'large' ? 15 : 6;
  const parentBox = useRef(null);
  const tempList = list && list.toJS();
  const fn = () => {
    const obj = parentBox.current;
    const currentBoxWidth = obj.clientWidth;
    const ratioArr = [];

    tempList.forEach(item => {
      const ratio = item['width'] / item['height'];
      if (isRotated(item['orientation'])) {
        item.ratio = 1 / ratio;
      } else {
        item.ratio = ratio;
      }
      ratioArr.push(item.ratio);
    });
    const resArr = [{ arr: [], start: 0 }];
    let currentAllWidth = 0;
    ratioArr.forEach((item, index) => {
      currentAllWidth = currentAllWidth + item * minHeight + gapWidth;
      if (currentAllWidth >= currentBoxWidth) {
        currentAllWidth = 0;
        const dealWithArr = resArr[resArr.length - 1].arr;
        const sum = dealWithArr.reduce((a, b) => a + b, 0);
        resArr[resArr.length - 1].height = parseInt(
          (currentBoxWidth - dealWithArr.length * gapWidth) / sum
        );
        resArr[resArr.length] = {
          arr: [item],
          start: index,
        };
        currentAllWidth = currentAllWidth + item * minHeight + gapWidth;
      } else {
        resArr[resArr.length - 1].arr.push(item);
        resArr[resArr.length - 1].end = index;
      }
    });
    resArr.forEach(item => {
      item.arr.forEach((inner, idx) => {
        tempList[item.start + idx].viewWidth =
          tempList[item.start + idx]['ratio'] * (item.height || minHeight);
        tempList[item.start + idx].viewHeight = item.height || minHeight;
        if (!item.height) {
          // 当不存在height为最后一行 此时style 为 flex start
          tempList[item.start + idx].lastLine = true;
        }
      });
    });
    setViewArr([...tempList]);
  };

  const onResize = () => {
    fn();
  };
  useEffect(() => {
    fn();
  }, [list]);
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [list]);
  return (
    <div className="x-water-fall-wrap">
      <div className="x-water-fall horizontalWaterFallBox" ref={parentBox}>
        {list.map((item, idx) => {
          return (
            <div
              key={item.get('enc_image_uid')}
              className={grid_spacing === 'regular' ? 'hlistbox' : 'hlistbox largeSpace'}
              style={{
                width: viewArr[idx] && viewArr[idx]['viewWidth'],
                height: viewArr[idx] && viewArr[idx]['viewHeight'],
                flexGrow: viewArr[idx] && viewArr[idx]['lastLine'] ? '0' : '1',
              }}
            >
              {renderCard(item, idx, { grid_style })}
            </div>
          );
        })}
      </div>
      {list.size !== 0 && (
        <XButton className="back-button dark" onClick={() => parentBox.current.scrollIntoView()}>
          {t('BACK_TO_TOP')}
        </XButton>
      )}
    </div>
  );
};
export default memo(H);
