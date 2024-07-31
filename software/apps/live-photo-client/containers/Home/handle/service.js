import { getDownloadUrl } from '@apps/live-photo-client/utils/helper';
import { getLastInfoByList } from '@apps/live-photo-client/utils/utils';
import service from '@apps/workspace/services';

/**
 * 获取image list
 * @param {*} that
 * @param {*} isReload
 */
const getContentList = async (that, isReload = false) => {
  const { urls, qs, currentSortAsc, images, isLoadingImageList, pageSize, hasMore, categoryId } =
    that.state;
  const {
    pageSetting: { getImageId },
    broadcastActivity,
  } = that.props;
  const baseUrl = !__DEVELOPMENT__ && __isCN__ ? urls.cdnBaseUrl : urls.saasBaseUrl;
  const enc_broadcast_id = qs.enc_broadcast_id;
  let last_enc_album_content_rel_id = '';
  let last_shot_time = ''; // 每一页的最后的那条数据的拍摄时间
  let last_repeat_album_content_rel_id = ''; // 需要判断最后的shot_time是否还有重复的，如果有把对应的 last_enc_album_content_rel_id 都传过来
  const is_asc = currentSortAsc;
  const sort_type = broadcastActivity.get('sort_type'); // 新增直播间排序方式
  if (isLoadingImageList || !hasMore) return;
  if (categoryId === '') return; // 当分类id没有值时不加载
  if (images.length > 0 && !isReload) {
    last_enc_album_content_rel_id = images[images.length - 1].enc_album_content_rel_id;
    const { lastShotTime, lastRepeatAlbumContentRelId } = getLastInfoByList(images);
    last_shot_time = lastShotTime;
    last_repeat_album_content_rel_id = lastRepeatAlbumContentRelId;
  }
  try {
    that.setState({
      isLoadingImageList: true,
    });
    const data = await service.getContentList({
      baseUrl,
      enc_broadcast_id,
      last_enc_album_content_rel_id,
      is_asc,
      page_size: pageSize,
      category_id: categoryId, // 分类id
      sort_type, // 新增直播间排序方式
      last_shot_time, // 每一页的最后的那条数据的拍摄时间
      last_repeat_album_content_rel_id, // 需要判断最后的shot_time是否还有重复的，如果有把对应的 last_enc_album_content_rel_id 都传过来
    });
    if (data && data.ret_code == 200000) {
      const { album_content_list, last_search_time } = data.data;
      const newImages = (
        isReload ? [...album_content_list] : images.concat(album_content_list)
      ).map(item => {
        const imgUrl = getDownloadUrl({
          baseUrl,
          enc_image_uid: getImageId(item),
          size: 3,
        });
        const masterUrl = getDownloadUrl({
          baseUrl,
          enc_image_uid: getImageId(item),
        });
        return {
          ...item,
          imgUrl,
          masterUrl,
        };
      });
      that.setState({
        images: newImages,
        hasMore: album_content_list.length === pageSize,
        lastSearchTime: last_search_time,
      });
    }
    // console.log('data', data);
    that.setState({
      isLoadingImageList: false,
    });
  } catch (e) {
    that.setState({
      isLoadingImageList: false,
    });
    console.error(e);
  }
};

/**
 * 获取热门image list
 * @param {*} that
 * @param {*} isReload
 */
const getHotContentList = async (that, isReload = false) => {
  const { urls, qs, hotImages, isLoadingHotImageList, pageSize, hasHotImageMore } = that.state;
  const baseUrl = !__DEVELOPMENT__ && __isCN__ ? urls.cdnBaseUrl : urls.saasBaseUrl;
  const enc_broadcast_id = qs.enc_broadcast_id;
  let last_enc_album_content_rel_id = '';
  const {
    pageSetting: { getImageId },
  } = that.props;

  if (isLoadingHotImageList || !hasHotImageMore) return;
  if (hotImages.length > 0 && !isReload) {
    last_enc_album_content_rel_id = hotImages[hotImages.length - 1].enc_album_content_rel_id;
  }
  try {
    that.setState({
      isLoadingHotImageList: true,
    });
    const data = await service.getHotContentList({
      baseUrl,
      enc_broadcast_id,
      last_enc_album_content_rel_id,
      page_size: pageSize,
    });
    if (data && data.ret_code == 200000) {
      const newImages = hotImages.concat(data.data.album_content_list).map(item => {
        const imgUrl = getDownloadUrl({
          baseUrl,
          enc_image_uid: getImageId(item),
          size: 3,
        });
        const masterUrl = getDownloadUrl({
          baseUrl,
          enc_image_uid: getImageId(item),
        });
        return {
          ...item,
          imgUrl,
          masterUrl,
        };
      });
      that.setState({
        hotImages: newImages,
        hasHotImageMore: data.data.length == pageSize,
      });
    }
    that.setState({
      isLoadingHotImageList: false,
    });
  } catch (e) {
    that.setState({
      isLoadingHotImageList: false,
    });
    console.error(e);
  }
};

// const getTimeSegmentGroup = async (that) => {
//     const { urls, qs, hotImages, isLoadingTimeSegmentGroup } = that.state;
//     const baseUrl = urls.saasBaseUrl;
//     const enc_broadcast_id = qs.enc_broadcast_id;
//     if (isLoadingTimeSegmentGroup) return
//     try {
//         that.setState({
//             isLoadingTimeSegmentGroup: true,
//         });
//         const data = await service.getTimeSegmentGroup({
//             baseUrl,
//             enc_broadcast_id
//         });
//         if (data && data.ret_code == 200000) {
//             that.setState({
//                 timeSegmentGroup: data.data
//             });
//         }
//         that.setState({
//             isLoadingTimeSegmentGroup: false,
//         });
//     } catch (e) {
//         that.setState({
//             isLoadingTimeSegmentGroup: false,
//         });
//         console.error(e);
//     }
// }

// const getContentListByTimeSegment = async (that, element) => {
//     const { urls, qs, timeSegmentGroup, isLoadingContentListByTimeSegment, currentSortAsc } = that.state;
//     const { begin_time, end_time } = element
//     const baseUrl = urls.saasBaseUrl;
//     const enc_broadcast_id = qs.enc_broadcast_id;
//     const is_asc = currentSortAsc;
//     const last_enc_album_content_rel_id = '';

//     if (isLoadingContentListByTimeSegment) return
//     try {
//         that.setState({
//             isLoadingContentListByTimeSegment: true,
//         });
//         const data = await service.getContentListByTimeSegment({
//             baseUrl,
//             enc_broadcast_id,
//             begin_time,
//             end_time,
//             last_enc_album_content_rel_id,
//             is_asc
//         });
//         if (data && data.ret_code == 200000) {
//             element.images = data.data
//         }
//         that.setState({
//             isLoadingContentListByTimeSegment: false,
//         });
//     } catch (e) {
//         that.setState({
//             isLoadingContentListByTimeSegment: false,
//         });
//         console.error(e);
//     }
// }

export default {
  getContentList,
  getHotContentList,
  // getTimeSegmentGroup,
  // getContentListByTimeSegment,
};
