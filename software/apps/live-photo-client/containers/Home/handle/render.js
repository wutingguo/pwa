import React, { Fragment } from 'react';
import LivePhotoCollapse from '@apps/live-photo-client/components/LivePhotoCollapse';
import LazyLoad from 'react-lazy-load';
import XImg from '@resource/components/pwa/XImg';
import classNames from 'classnames';
// import { formatDate } from '@resource/lib/utils/dateFormat';
import { getDownloadUrl, getCropImageUrl } from '@apps/live-photo-client/utils/helper';
import service from './service';
import InfiniteScroll from '@apps/live-photo-client/components/InfiniteScroll';
import Empty from '@apps/live/components/Empty';

// import timePNG from '@apps/live-photo-client/icons/time.png';
// import locationPNG from '@apps/live-photo-client/icons/location.png';
// import discriptionPNG from '@apps/live-photo-client/icons/discription.png';

// // 直播信息显示部分
// const renderInfoSection = (that) => {
//   const { broadcastActivity } = that.props
//   const title = broadcastActivity.get('activity_name')
//   const subTitle = `已有${'27'}人次浏览了此相册`
//   const date = formatDate(broadcastActivity.get('begin_time'), '.')
//   const location = broadcastActivity.get('address')
//   const discription = broadcastActivity.get('activity_detail')
//   return (
//     <div className='info-box'>
//       <div className='title'>{title}</div>
//       <div className='sub-title'>{subTitle}</div>
//       <div className='info-items'>
//         <div className='items'>
//           <img src={timePNG}></img>
//           <div>{date}</div>
//         </div>
//         <div className='items'>
//           <img src={locationPNG}></img>
//           <div>{location}</div>
//         </div>
//         <div className='items'>
//           <img src={discriptionPNG}></img>
//           <div>{discription}</div>
//         </div>
//       </div>
//     </div>
//   )
// }

/**
 * 菜单栏显示
 * @param {*} that
 */
const renderMenuSection = that => {
  const { sets, currentSetId } = that.state;
  const { activityInfo } = that.props;
  const { menu_vo } = activityInfo.toJS();
  const ulClassName = classNames('set-list', {
    center: menu_vo?.layout_type === 'CENTER'
  });
  // console.log('sets', sets);
  return (
    <div className="set-items-box">
      <ul className={ulClassName}>
        {sets &&
          sets.map(set => {
            const cName = classNames('set-item', {
              active: currentSetId === set.id
            });
            return (
              <li
                key={set.id}
                className={cName}
                title={set.name}
                onClick={that.onSelectSet.bind(that, set.id)}
              >
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
// const renderCard = (that, item, index) => {
//   const { envUrls } = that.props;
//   const { images } = that.state
//   const baseUrl = envUrls.get('saasBaseUrl');
//   const enc_image_uid = item.get("show_enc_content_id")
//   const imgUrl = getImageUrl(baseUrl, enc_image_uid, 3)
//   const XImgProps = {
//     src: imgUrl,
//     className: 'image',
//   };

//   return (
//     <div onClick={() => that.showImageViewer(index, images)}>
//       <LazyLoad>
//         <XImg {...XImgProps} />
//       </LazyLoad>
//     </div>
//   );
// };

/**
 * 时间线渲染
 * @param {*} that
 */
// const renderTimeLineLayout = (that) => {
//   const { timeSegmentGroup, currentTimeSegmentImages } = that.state
//   const timeLineGroupHTML = [];
//   timeSegmentGroup.forEach(element => {
//     const props = {
//       element,
//       html: renderCollapsePhotosGroup(that, element && element.images)
//     };
//     timeLineGroupHTML.push(
//       <div className="row">
//         <div className="cell text">
//           <LivePhotoCollapse {...props} showCollapsePhotosGroup={that.showCollapsePhotosGroup} />
//         </div>
//       </div>
//     );
//   });
//   return timeLineGroupHTML;
// };

// const renderCollapsePhotosGroup = (that, images = []) => {
//   const htmls = [];
//   htmls.push(
//     renderGridLayout(that, images, false)
//   )
//   return <div className='photo-collapse-warp'>{htmls}</div>;
// }

/**
 * 九宫格渲染
 * @param {*} that
 */
// const renderGridLayout = (that, images) => {
//   const { hasMore, pageSize, isLoadingImageList, innerWidth } = that.state;
//   const { envUrls, activityInfo } = that.props;
//   // const groupedArray = splitArray(images, 3);
//   const baseUrl = envUrls.get('saasBaseUrl');
//   const isEmpty = images.length === 0;

//   const { menu_vo } = activityInfo.toJS();
//   const gridClassName = classNames('grid-container');
//   return (
//     <>
//       {isEmpty ? (
//         <Empty />
//       ) : (
//         <div>
//           <div className={gridClassName} style={{ width: innerWidth }}>
//             {images.map((item, imageIndex) => {
//               const encImgId = item.show_enc_content_id;
//               const exifOrientation = item.orientation;
//               const imgUrl = getCropImageUrl({ baseUrl, encImgId, exifOrientation });
//               const XImgProps = {
//                 src: imgUrl,
//                 type: 'tag',
//                 className: 'image'
//               };
//               return (
//                 <div onClick={() => that.showImageViewer(imageIndex, images)} className="grid-item">
//                   <XImg {...XImgProps} />
//                 </div>
//               );
//             })}
//           </div>
//           {images.length >= pageSize ? (
//             <InfiniteScroll
//               onload={() => service.getContentList(that)}
//               loading={isLoadingImageList}
//             >
//               已经到底了
//             </InfiniteScroll>
//           ) : null}
//         </div>
//       )}
//     </>
//   );
// };

/**
 * 渲染热门图片列表
 * @param {*} that
 */
// const renderHotImages = that => {
//   const { envUrls } = that.props;
//   const { hotImages, hasHotImageMore, pageSize, innerWidth } = that.state;
//   // const backgroundColorStyle = [{ background: '#EE6107' }, { background: '#EF8307' }, { background: '#F2BC0A' }]
//   const baseUrl = envUrls.get('saasBaseUrl');
//   const isEmpty = hotImages.length === 0;
//   return (
//     <>
//       {isEmpty ? (
//         <Empty />
//       ) : (
//         <div>
//           <div className="grid-container" style={{ width: innerWidth }}>
//             {hotImages.map((item, imageIndex) => {
//               const encImgId = item.show_enc_content_id;
//               const exifOrientation = item.orientation;
//               const imgUrl = getCropImageUrl({ baseUrl, encImgId, exifOrientation });
//               const XImgProps = {
//                 src: imgUrl,
//                 type: 'tag',
//                 className: 'image'
//               };
//               const number = imageIndex;
//               return (
//                 <div className="grid-item" onClick={() => that.showImageViewer(number, hotImages)}>
//                   <XImg {...XImgProps} />
//                 </div>
//               );
//             })}
//           </div>
//           {hotImages.length >= pageSize && (
//             <InfiniteScroll
//               onload={() => service.getHotContentList(that)}
//               loading={hasHotImageMore}
//             >
//               已经到底了
//             </InfiniteScroll>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// const renderSortModal = (that) => {
//   const { sortTypes, sort, currentSortTypeIndex, currentSortAsc } = that.state
//   return (
//     <div className='sort-warp'>
//       <div className='sort-left-warp'>
//         <ul className="sort-list">
//           {sortTypes.map((set) => {
//             const isSelected = currentSortTypeIndex === set.id
//             const cName = classNames('sort-item', {
//               active: isSelected
//             });
//             const icon = isSelected ? set.iconSelected : set.icon
//             return (
//               <li
//                 key={set.id}
//                 className={cName}
//                 onClick={that.onSelectSortType.bind(that, set.id)}
//               >
//                 <img src={icon}></img>
//                 <span>{set.name}</span>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//       <div className='sort-right-warp'>
//         <ul className="sort-list">
//           {sort.map((set) => {
//             const cName = classNames('sort-item', {
//               active: currentSortAsc === set.asc
//             });
//             return (
//               <li
//                 key={set.asc}
//                 className={cName}
//                 onClick={that.onSelectSort.bind(that, set.asc)}
//               >
//                 <span>{set.name}</span>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </div>
//   )
// }

const splitArray = (array, groupSize) => {
  const newArray = [];
  for (let i = 0; i < array.length; i += groupSize) {
    const group = array.slice(i, i + groupSize);
    newArray.push(group);
  }
  return newArray;
};

export default {
  // renderInfoSection,
  renderMenuSection
  // renderCard,
  // renderHotImages,
  // renderTimeLineLayout,
  // renderGridLayout
  // renderSortModal,
};
