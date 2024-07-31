import { InfiniteScroll } from 'antd-mobile';
import React from 'react';

// import { Container } from './layout';
import GridLayout from '../GridLayout';

export default function (props) {
  const {
    images,
    hasMore,
    pageSize,
    loadTimeLineImageData,
    envUrls,
    showImageViewer,
    puzzle,
    total,
  } = props;
  return (
    <div className="photo-collapse-warp">
      <GridLayout
        isShowInfiniteScroll={false}
        images={images}
        hasMore={hasMore}
        pageSize={pageSize}
        envUrls={envUrls}
        showImageViewer={showImageViewer}
        puzzle={puzzle}
        total={total}
      />
      <InfiniteScroll loadMore={() => loadTimeLineImageData()} hasMore={hasMore}>
        <div></div>
      </InfiniteScroll>
    </div>
  );
}
