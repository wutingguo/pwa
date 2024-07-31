import { InfiniteScroll } from 'antd-mobile';
import React, { useEffect } from 'react';

import XWaterFall from '@resource/components/XWaterFall';

import Card from './Card';

export default function WaterfallLayout(props) {
  const {
    showImageViewer,
    list,
    loadData,
    isShowInfiniteScroll,
    images,
    pageSize,
    hasMore,
    envUrls,
    total,
    puzzle,
  } = props;
  // set图片列表.
  const waterFallProps = {
    cols: 2,
    minWidth: 300,
    maxWidth: 400,
    useOldPhotoOrientation: false,
    showBackButton: false,
    list,
    renderCard: (item, index, { style }) => {
      return (
        <Card
          item={item}
          images={images}
          index={index}
          style={style}
          showImageViewer={showImageViewer}
          envUrls={envUrls}
          total={total}
          puzzle={puzzle}
        />
      );
    },
    // onScrollToBottom: loadData,
    widthSpace: 7,
  };

  return (
    <div>
      <XWaterFall {...waterFallProps} />
      {isShowInfiniteScroll && images.length >= pageSize && (
        <InfiniteScroll threshold={500} loadMore={() => loadData()} hasMore={hasMore}>
          <div></div>
        </InfiniteScroll>
      )}
    </div>
  );
}
