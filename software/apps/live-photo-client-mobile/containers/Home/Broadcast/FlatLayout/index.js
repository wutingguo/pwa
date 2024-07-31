import { InfiniteScroll } from 'antd-mobile';
import React from 'react';

import LazyImage from '@apps/live-photo-client-mobile/components/LazyImage';
import { useSetting } from '@apps/live-photo-client-mobile/constants/context';
import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';

import './index.scss';

/**
 * 平铺式布局
 * @typedef {Object} FlatLayoutProps
 * @property {boolean} isShowInfiniteScroll 是否显示无限滚动
 * @property {Array} images 图片列表
 * @property {boolean} hasMore 是否可以加载更多图
 * @property {number} pageSize 分页
 * @property {string} envUrls base url
 * @property {Function} showImageViewer 查看大图
 * @property {Function} loadData 继续加载图片数据
 * @property {number} total 图片总数
 * @property {Object} puzzle 拼图对象
 * @param {FlatLayoutProps} props
 */
const FlatLayout = props => {
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
  const { getImageId } = useSetting();
  const baseUrl =
    !__DEVELOPMENT__ && __isCN__ ? envUrls.get('cdnBaseUrl') : envUrls.get('saasBaseUrl');

  return (
    <div className="flat-container">
      {images?.map((item, imageIndex) => {
        const enc_image_uid = getImageId(item);
        const imgUrl = getRotateImageUrl({ baseUrl, enc_image_uid });

        return (
          <div
            className="flat-item"
            onClick={() => showImageViewer(imageIndex, images, { total: total || images.length })}
          >
            <LazyImage
              className="flat-item-image"
              info={item}
              src={imgUrl}
              puzzle={puzzle}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        );
      })}
      {/* 无限滚动 */}
      {isShowInfiniteScroll && images.length >= pageSize && (
        <InfiniteScroll threshold={500} loadMore={() => loadData()} hasMore={hasMore}>
          <div></div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default FlatLayout;
