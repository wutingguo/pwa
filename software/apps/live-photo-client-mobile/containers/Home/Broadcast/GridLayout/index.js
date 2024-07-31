import { Image, InfiniteScroll } from 'antd-mobile';
import React from 'react';

import LazyImage from '@apps/live-photo-client-mobile/components/LazyImage';
import { useSetting } from '@apps/live-photo-client-mobile/constants/context';
// import LazyLoad from 'react-lazy-load';
import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';

export default function GridLayout(props) {
  const { getImageId } = useSetting();

  const {
    isShowInfiniteScroll,
    images,
    hasMore,
    pageSize,
    envUrls,
    showImageViewer,
    loadData,
    puzzle,
    total,
  } = props;

  const baseUrl =
    !__DEVELOPMENT__ && __isCN__ ? envUrls.get('cdnBaseUrl') : envUrls.get('saasBaseUrl');
  return (
    <div className="grid-container">
      {images.map((item, imageIndex) => {
        const enc_image_uid = getImageId(item);
        const imgUrl = getRotateImageUrl({ baseUrl, enc_image_uid });
        return (
          <div
            className="grid-item"
            onClick={() => showImageViewer(imageIndex, images, { total: total || images.length })}
          >
            <LazyImage
              lazy
              info={item}
              src={imgUrl}
              className="image-lazy"
              style={{ maxHeight: '100%', maxWidth: '100%', width: '100%', height: 'auto' }}
              fit="cover"
              puzzle={puzzle}
            />
          </div>
        );
      })}
      {isShowInfiniteScroll && images.length >= pageSize && (
        <InfiniteScroll threshold={500} loadMore={() => loadData()} hasMore={hasMore}>
          <div></div>
        </InfiniteScroll>
      )}
    </div>
  );
}
