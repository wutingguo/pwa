import React, { useEffect, useState } from 'react';

// import { Image } from 'antd-mobile';
// import LazyLoad from 'react-lazy-load';
import LazyImage from '@apps/live-photo-client-mobile/components/LazyImage';
import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';

const splitArray = (array, groupSize) => {
  const newArray = [];
  let sliceIndex = 0;
  if (array.length <= groupSize) {
    newArray.push(array);
  } else {
    for (let i = 0; i < array.length; i += array.length - groupSize) {
      const group = array.slice(sliceIndex, i + groupSize);
      sliceIndex += groupSize;
      if (group.length > 0) {
        newArray.push(group);
      }
    }
  }
  return newArray;
};

export default function HotImages(props) {
  const {
    envUrls,
    hotImages,
    showImageViewer,
    isShow,
    hotImageTotal,
    puzzle,
    isLoadingHotImageList,
  } = props;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isShow || count === 0) {
      setCount(n => n + 1);
    }
  }, [isShow]);

  const groupedArray = splitArray(hotImages?.filter(Boolean), 3);
  const backgroundColorStyle = [
    { background: '#EE6107' },
    { background: '#EF8307' },
    { background: '#F2BC0A' },
  ];
  const baseUrl =
    !__DEVELOPMENT__ && __isCN__ ? envUrls.get('cdnBaseUrl') : envUrls.get('saasBaseUrl');
  return (
    <>
      {count !== 0 ? (
        <div className="hot-grid-container" style={{ display: isShow ? 'block' : 'none' }}>
          {groupedArray.map((items, index) => {
            if (index == 0) {
              return (
                <div className="top-grid-warp">
                  {items.map((item, imageIndex) => {
                    const enc_image_uid = item.show_enc_content_id;
                    const imgUrl = getRotateImageUrl({ baseUrl, enc_image_uid });
                    const number = imageIndex + 1;
                    return (
                      <div
                        className="top-grid-item"
                        onClick={() =>
                          showImageViewer(imageIndex, hotImages, { total: hotImageTotal })
                        }
                      >
                        <div style={backgroundColorStyle[imageIndex]} className="number">
                          {number}
                        </div>
                        <div offset={1500} style={{ width: '100%' }}>
                          <LazyImage
                            className="image"
                            src={imgUrl}
                            info={item}
                            style={{
                              maxHeight: '100%',
                              maxWidth: '100%',
                              width: '100%',
                              height: '100%',
                            }}
                            puzzle={puzzle}
                            fit="cover"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
            return (
              <div className="grid-container">
                {items.map((item, imageIndex) => {
                  const enc_image_uid = item.show_enc_content_id;
                  const imgUrl = getRotateImageUrl({ baseUrl, enc_image_uid });
                  const number = imageIndex + 1 + 3 * index;
                  return (
                    <div
                      className="grid-item"
                      onClick={() =>
                        showImageViewer(number - 1, hotImages, { total: hotImageTotal })
                      }
                    >
                      {number < 10 && <div className="number">{number}</div>}
                      <div className="lazy" offset={1500}>
                        <LazyImage
                          className="image"
                          src={imgUrl}
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            width: '100%',
                            height: '100%',
                          }}
                          fit="cover"
                          info={item}
                          puzzle={puzzle}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
