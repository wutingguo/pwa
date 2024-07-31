import React from 'react';

import LivePhotoCollapse from '@apps/live-photo-client-mobile/components/LivePhotoCollapse';

import Item from './Item';

export default function TimeLineLayout(props) {
  const {
    timeSegmentGroup,
    pageSize,
    loadTimeLineImageData,
    showCollapsePhotosGroup,
    envUrls,
    showImageViewer,
    puzzle,
  } = props;

  return (
    <div>
      {timeSegmentGroup.map((element, index) => {
        const { begin_time, end_time, total } = element;
        const props = {
          element,
        };
        return (
          <div className="row" key={begin_time + end_time}>
            <div className="cell text">
              <LivePhotoCollapse
                defaultOpened={index === 0}
                {...props}
                showCollapsePhotosGroup={showCollapsePhotosGroup}
              >
                {(images, hasMore) => {
                  return (
                    <Item
                      images={images}
                      hasMore={hasMore}
                      pageSize={pageSize}
                      loadTimeLineImageData={loadTimeLineImageData}
                      envUrls={envUrls}
                      puzzle={puzzle}
                      total={total}
                      showImageViewer={showImageViewer}
                    />
                  );
                }}
              </LivePhotoCollapse>
            </div>
          </div>
        );
      })}
    </div>
  );
}
