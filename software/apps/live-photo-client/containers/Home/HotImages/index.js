import React from 'react';

import useWaterfall from '@common/hooks/useWaterfall';

import Empty from '@apps/live-photo-client/components/Empty';
import InfiniteScroll from '@apps/live-photo-client/components/InfiniteScroll';
import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';

import './index.scss';

export default function HotImages(props) {
  const {
    envUrls,
    hotImages,
    hasHotImageMore,
    pageSize,
    showImageViewer,
    getHotContentList,
    children,
    isShow,
  } = props;
  const [data, { maxHeight }] = useWaterfall(hotImages, {
    root: '#hot_content',
    space: 10,
    depend: [isShow],
  });

  // const baseUrl = __isCN__ ? envUrls.get('cdnBaseUrl') : envUrls.get('saasBaseUrl');
  const isEmpty = hotImages.length === 0;

  return (
    <div
      style={{ display: isShow ? 'flex' : 'none', justifyContent: 'center' }}
      className="hot_box"
    >
      <div style={{ width: '80%', position: 'relative' }} id="hot_content">
        {isEmpty ? (
          <Empty style={{ height: 400, backgroundPosition: '40%', backgroundSize: 'contain' }} />
        ) : (
          <div>
            <div className="hot_list">
              {data.map((item, imageIndex) => {
                const encImgId = item.show_enc_content_id;
                {
                  /* const imgUrl = getDownloadUrl({ baseUrl, enc_image_uid: encImgId, size: 3 }); */
                }
                const XImgProps = {
                  src: item.imgUrl,
                };
                const number = imageIndex;
                return (
                  <div
                    className="hot_item"
                    onClick={() => showImageViewer(number, data)}
                    key={item.src}
                    style={{
                      position: 'absolute',
                      transform: `translate3d(${item.left}px, ${item.top}px, 0)`,
                      width: isShow ? item.imageBoxWidth : 0,
                      height: item.imageBoxHeight,
                    }}
                  >
                    <img
                      className="item_img"
                      {...XImgProps}
                      style={{ width: item.imageWidth, height: item.imageHeight }}
                    />
                  </div>
                );
              })}
            </div>
            {data.length >= pageSize && (
              <div
                style={{ position: 'absolute', top: maxHeight, width: '100%', textAlign: 'center' }}
              >
                {/* <InfiniteScroll
                                    onload={() => getHotContentList()}
                                    loading={hasHotImageMore}
                                > */}
                已经到底了
                {/* </InfiniteScroll> */}
              </div>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
