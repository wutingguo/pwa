import { Image, InfiniteScroll } from 'antd-mobile';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import LazyLoad from 'react-lazy-load';

import { formatDateBeginToEnd } from '@resource/lib/utils/dateFormat';
import { isRotated } from '@resource/lib/utils/exif';

import LazyImage from '@apps/live-photo-client-mobile/components/LazyImage';
import LivePhotoCollapse from '@apps/live-photo-client-mobile/components/LivePhotoCollapse';
import descriptionPNG from '@apps/live-photo-client-mobile/icons/description.png';
import locationPNG from '@apps/live-photo-client-mobile/icons/location.png';
import timePNG from '@apps/live-photo-client-mobile/icons/time.png';
import { getRotateImageUrl } from '@apps/live-photo-client-mobile/utils/helper';

// 直播信息显示部分
const renderInfoSection = that => {
  const { albumViewData } = that.state;
  const { broadcastActivity, broadcastAlbum, activityInfo } = that.props;
  const title = broadcastAlbum.get('album_name');
  const subTitle = albumViewData.count || '0';

  // 优化开始时间与结束时间对比
  const beginTime = broadcastActivity.get('begin_time');
  const endTime = broadcastActivity.get('end_time');
  const date = formatDateBeginToEnd(beginTime, endTime, '.');

  const location = broadcastActivity.get('address');
  const country_en = broadcastActivity.get('country');
  const city_en = broadcastActivity.get('city');
  const city = broadcastActivity.get('city');
  const firstIndex = city.indexOf('-');
  const newCity = city.slice(firstIndex + 1);
  const description = broadcastActivity.get('activity_detail');
  const address = `${newCity} ${location}`;

  // CN-直播隐藏字段
  const fieldConfigVo = activityInfo.get('field_config_vo');

  const getAddress = () => {
    if (city_en && location) {
      return `${location},${' ' + city_en},${' ' + country_en}`;
    }
    return !city_en
      ? !location
        ? `${country_en}`
        : `${location},${' ' + country_en}`
      : `${city_en},${' ' + country_en}`;
  };

  /**
   * CN-直播隐藏字段
   * 相册名称
   * 活动时间
   * 拍摄城市
   * @param {'hidden_album_name'|'hidden_broadcast_date'|'hidden_broadcast_address'} hiddenName 隐藏的字段名称
   */
  const isHidden = hiddenName => {
    if (!__isCN__) {
      return false;
    }
    return !!fieldConfigVo?.get(hiddenName);
  };

  /**
   * CN-直播地址有什么显示什么
   */
  const showCity = () => {
    if (!__isCN__) {
      return address;
    }
    const cityArray = broadcastActivity?.get('city').split('-');
    const newCitys = cityArray.join(' ');
    if (newCitys && location) {
      return `${newCitys} ${location}`;
    }
    if (newCitys) {
      return newCitys;
    }
    if (location) {
      return location;
    }
  };

  return (
    <div className="info-box">
      {!isHidden('hidden_album_name') && <p className="title">{title}</p>}
      <div className="sub-title">
        {__isCN__ && '已有'}
        <span className="count">
          {subTitle}
          {!__isCN__ && ' '}
        </span>
        {t('LPCM_PHTOT_VIEW')}
      </div>
      <div className="info-items">
        {!isHidden('hidden_broadcast_date') && date && (
          <div className="items">
            <img className="image" src={timePNG}></img>
            <div>{date}</div>
          </div>
        )}
        {!__isCN__ && country_en && (
          <div className="items">
            <img className="image" src={locationPNG}></img>
            <div>{getAddress()}</div>
          </div>
        )}
        {!isHidden('hidden_broadcast_address') && __isCN__ && showCity() && (
          <div className="items">
            <img className="image" src={locationPNG}></img>
            <div>{showCity()}</div>
          </div>
        )}
        {description && (
          <div className="items">
            <img className="image" src={descriptionPNG}></img>
            <div>{description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 菜单栏显示
 * @param {*} that
 */
const renderMenuSection = that => {
  const { sets, currentSetId } = that.state;
  const { menu } = that.props;
  const layout = menu.get('layout_type');
  const sName = classNames('set-items-box', {
    layoutCenter: layout != 'LEFT',
  });
  return (
    <div className={sName}>
      <ul className="set-list">
        {sets &&
          sets.map(set => {
            const cName = classNames('set-item', {
              active: currentSetId === set.id,
            });
            return (
              <li key={set.id} className={cName} onClick={that.onSelectSet.bind(that, set.id)}>
                <span>{set.name}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

/**
 * 渲染瀑布流中的item
 * @param {*} that
 * @param {*} item
 */
const renderCard = (that, item, index, options) => {
  const { style } = options;
  const { envUrls } = that.props;
  const { images } = that.state;
  const baseUrl = envUrls.get('saasBaseUrl');
  const enc_image_uid = item.get('show_enc_content_id');
  const exifOrientation = item.get('orientation');
  const imgUrl = getRotateImageUrl({ baseUrl, enc_image_uid });
  const isRotate = isRotated(exifOrientation);
  const height =
    (isRotate ? item.get('width') / item.get('height') : item.get('height') / item.get('width')) *
      style?.width -
    10;
  return (
    <div onClick={() => that.showImageViewer(index, images)} style={{ ...style, height }}>
      <div offset={1500}>
        <LazyImage src={imgUrl} style={{ ...style, height }} index={index} />
      </div>
    </div>
  );
};

/**
 * 时间线渲染
 * @param {*} that
 */
const renderTimeLineLayout = that => {
  const { timeSegmentGroup } = that.state;
  const timeLineGroupHTML = [];
  timeSegmentGroup.forEach(element => {
    const props = {
      element,
      html: renderCollapsePhotosGroup(that, element),
    };
    timeLineGroupHTML.push(
      <div className="row">
        <div className="cell text">
          <LivePhotoCollapse {...props} showCollapsePhotosGroup={that.showCollapsePhotosGroup} />
        </div>
      </div>
    );
  });
  return timeLineGroupHTML;
};

const renderCollapsePhotosGroup = (that, element) => {
  const { images = [], hasMore } = element;
  return (
    <div className="photo-collapse-warp">
      {renderGridLayout(that, images, false)}
      <InfiniteScroll loadMore={() => that.loadTimeLineImageData()} hasMore={hasMore}>
        <div></div>
      </InfiniteScroll>
    </div>
  );
};

/**
 * 九宫格渲染
 * @param {*} that
 */
const renderGridLayout = (that, images, isShowInfiniteScroll = true) => {
  const { hasMore, pageSize } = that.state;
  const { envUrls } = that.props;
  const baseUrl = envUrls.get('saasBaseUrl');
  return (
    <div className="grid-container">
      {images.map((item, imageIndex) => {
        const enc_image_uid = item.show_enc_content_id;
        const imgUrl = getRotateImageUrl({ baseUrl, enc_image_uid });
        return (
          <LazyLoad className="grid-item" offset={1500}>
            <Image
              src={imgUrl}
              fit="cover"
              onClick={() => that.showImageViewer(imageIndex, images)}
            />
          </LazyLoad>
        );
      })}
      {isShowInfiniteScroll && images.length >= pageSize && (
        <InfiniteScroll loadMore={() => that.loadData()} hasMore={hasMore}>
          <div></div>
        </InfiniteScroll>
      )}
    </div>
  );
};

/**
 * 渲染热门图片列表
 * @param {*} that
 */
const renderHotImages = that => {
  const { envUrls } = that.props;
  const { hotImages } = that.state;
  const groupedArray = splitArray(hotImages, 3);
  const backgroundColorStyle = [
    { background: '#EE6107' },
    { background: '#EF8307' },
    { background: '#F2BC0A' },
  ];
  const baseUrl = envUrls.get('saasBaseUrl');
  return (
    <div className="hot-grid-container">
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
                    onClick={() => that.showImageViewer(imageIndex, hotImages)}
                  >
                    <div style={backgroundColorStyle[imageIndex]} className="number">
                      {number}
                    </div>
                    <LazyLoad offset={1500}>
                      <Image className="image" src={imgUrl} fit="cover" />
                    </LazyLoad>
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
                  onClick={() => that.showImageViewer(number - 1, hotImages)}
                >
                  {number < 10 && <div className="number">{number}</div>}
                  <LazyLoad className="lazy" offset={1500}>
                    <Image className="image" src={imgUrl} fit="cover" />
                  </LazyLoad>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const renderSortModal = that => {
  const { sortTypes, sort, currentSortTypeIndex, currentSortAsc } = that.state;
  return (
    <div className="sort-warp">
      <div className="sort-left-warp">
        <ul className="sort-list">
          {sortTypes.map(set => {
            const isSelected = currentSortTypeIndex === set.id;
            const cName = classNames('sort-item', {
              active: isSelected,
            });
            const icon = isSelected ? set.iconSelected : set.icon;
            return (
              <div>
                <li
                  key={set.id}
                  className={cName}
                  onClick={that.onSelectSortType.bind(that, set.id)}
                >
                  <img src={icon}></img>
                  <span>{set.name}</span>
                </li>
                <div className="line-warp">
                  <div className="line"></div>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
      <div className="sort-right-warp">
        <ul className="sort-list">
          {sort.map(set => {
            const cName = classNames('sort-item', {
              active: currentSortAsc === set.asc,
            });
            return (
              <li key={set.asc} className={cName} onClick={that.onSelectSort.bind(that, set.asc)}>
                <span>{set.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

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

export default {
  renderInfoSection,
  renderMenuSection,
  renderCard,
  renderHotImages,
  renderTimeLineLayout,
  renderGridLayout,
  renderSortModal,
};
