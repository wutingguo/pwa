import React, { useEffect, useRef } from 'react';

import useWaterfall from '@common/hooks/useWaterfall';

import Empty from '@apps/live-photo-client/components/Empty';
import InfiniteScroll from '@apps/live-photo-client/components/InfiniteScroll';

// import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';
import NavList from './NavList';

import './index.scss';

export default function Broadcast(props) {
  const {
    children,
    images,
    envUrls,
    isLoadingImageList,
    pageSize,
    showImageViewer,
    getContentList,
    isShow,
    broadcastAlbum,
    onChangeCategory,
  } = props;
  const boxRef = useRef(null);
  const [data, { maxHeight }] = useWaterfall(images, { root: boxRef, space: 10, depend: [isShow] });

  // const baseUrl =
  //   !__DEVELOPMENT__ && __isCN__ ? envUrls.get('cdnBaseUrl') : envUrls.get('saasBaseUrl');
  const isEmpty = images.length === 0;

  return (
    <div
      style={{ display: isShow ? 'flex' : 'none', justifyContent: 'center' }}
      className="broadcast_box"
    >
      <NavList
        baseUrl={envUrls.get('saasBaseUrl')}
        albumId={broadcastAlbum.get('album_id')}
        onChangeCategory={onChangeCategory}
      />
      <div style={{ width: '80%', position: 'relative' }} ref={ref => (boxRef.current = ref)}>
        {isEmpty ? (
          <Empty style={{ height: 400, backgroundPosition: '40%', backgroundSize: 'contain' }} />
        ) : (
          <div className="broadcast_list">
            {data.map((item, imageIndex) => {
              {
                /* const encImgId = item.show_enc_content_id; */
              }
              {
                /* const imgUrl = getDownloadUrl({ baseUrl, enc_image_uid: encImgId, size: 3 }); */
              }
              const XImgProps = {
                src: item.imgUrl,
                type: 'tag',
              };
              return (
                <div
                  onClick={() => showImageViewer(imageIndex, images, { autoUpdate: true })}
                  className="broadcast_item"
                  style={{
                    position: 'absolute',
                    transform: `translate3d(${item.left}px, ${item.top}px, 0)`,
                    width: item.imageBoxWidth,
                    height: item.imageBoxHeight,
                  }}
                  key={item.enc_album_content_rel_id} // 唯一key
                >
                  <img
                    {...XImgProps}
                    className="item_img"
                    style={{ width: item.imageWidth, height: item.imageHeight }}
                  />
                </div>
              );
            })}
            {data.length >= pageSize && isShow ? (
              <div style={{ position: 'absolute', top: maxHeight, width: '100%' }}>
                <InfiniteScroll onload={() => getContentList()} loading={isLoadingImageList}>
                  {t('LPCM_THE_END')}
                </InfiniteScroll>
              </div>
            ) : null}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
