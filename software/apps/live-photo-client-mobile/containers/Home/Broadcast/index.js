import React, { useEffect, useState } from 'react';

import EndModal from '@apps/live-photo-client-mobile/components/EndModal';

import FlatLayout from './FlatLayout';
import GridLayout from './GridLayout';
import NavList from './NavList';
import TimeLineLayout from './TimeLineLayout';
import WaterfallLayout from './WaterfallLayout';

import './index.scss';

export default function Broadcast(props) {
  const [count, setCount] = useState(0);
  const {
    currentSortTypeIndex,
    renderCard,
    list,
    loadData,
    timeSegmentGroup,
    hasMore,
    pageSize,
    loadTimeLineImageData,
    envUrls,
    showImageViewer,
    showCollapsePhotosGroup,
    isShow,
    total,
    puzzle,
    broadcastAlbum,
    activityInfo,
    onChangeCategory, // 点击分类id的事件
  } = props;

  useEffect(() => {
    if (isShow || count === 0) {
      setCount(n => n + 1);
    }
  }, [isShow]);

  const images = list.toJS();
  return (
    <>
      {count !== 0 ? (
        <div style={{ display: isShow ? 'block' : 'none' }} className="broadcast_box">
          {/* 按照时间线隐藏分类 */}
          {currentSortTypeIndex !== 2 && (
            <NavList
              baseUrl={envUrls.get('saasBaseUrl')}
              albumId={broadcastAlbum.get('album_id')}
              onChangeCategory={onChangeCategory}
            />
          )}
          {currentSortTypeIndex === 3 ? (
            <GridLayout
              isShowInfiniteScroll
              images={images}
              hasMore={hasMore}
              pageSize={pageSize}
              envUrls={envUrls}
              showImageViewer={showImageViewer}
              loadData={loadData}
              total={total}
              puzzle={puzzle}
            />
          ) : null}
          {currentSortTypeIndex === 2 ? (
            <TimeLineLayout
              timeSegmentGroup={timeSegmentGroup}
              pageSize={pageSize}
              loadTimeLineImageData={loadTimeLineImageData}
              showCollapsePhotosGroup={showCollapsePhotosGroup}
              envUrls={envUrls}
              showImageViewer={showImageViewer}
              puzzle={puzzle}
            />
          ) : null}
          {currentSortTypeIndex === 1 ? (
            <WaterfallLayout
              isShowInfiniteScroll
              renderCard={renderCard}
              list={list}
              loadData={loadData}
              images={images}
              hasMore={hasMore}
              pageSize={pageSize}
              showImageViewer={showImageViewer}
              envUrls={envUrls}
              total={total}
              puzzle={puzzle}
            />
          ) : null}
          {/* 新增平铺式 */}
          {currentSortTypeIndex === 4 && (
            <FlatLayout
              isShowInfiniteScroll
              images={images}
              hasMore={hasMore}
              pageSize={pageSize}
              envUrls={envUrls}
              showImageViewer={showImageViewer}
              loadData={loadData}
              total={total}
              puzzle={puzzle}
            />
          )}
          {__isCN__ && activityInfo.toJS().ending_advertise.status == 1 && (
            <EndModal activityInfo={activityInfo.toJS()} envUrls={envUrls} />
          )}
        </div>
      ) : null}
    </>
  );
}
