import { getLastInfoByList } from '@apps/live-photo-client-mobile/utils/utils';
import service from '@apps/workspace/services';

/**
 * 获取image list
 * @param {*} that
 * @param {*} isReload
 */
const getContentList = async (that, isReload = false) => {
  const {
    urls,
    qs,
    currentSortAsc,
    images,
    isLoadingImageList,
    pageSize,
    hasMore,
    hasMoreImageList,
    categoryId, // 分类id
  } = that.state;
  const { broadcastActivity } = that.props;
  const baseUrl = urls.saasBaseUrl;
  const enc_broadcast_id = qs.enc_broadcast_id;
  let last_enc_album_content_rel_id = '';
  let last_shot_time = ''; // 每一页的最后的那条数据的拍摄时间
  let last_repeat_album_content_rel_id = ''; // 需要判断最后的shot_time是否还有重复的，如果有把对应的 last_enc_album_content_rel_id 都传过来
  const is_asc = currentSortAsc;
  const sort_type = broadcastActivity.get('sort_type'); // 新增直播间排序方式
  if ((isLoadingImageList || !hasMore) && !isReload) return;
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
    let imageList = [];
    if (data && data.ret_code == 200000) {
      const { album_content_list, last_search_time, total } = data.data;
      imageList = album_content_list;
      that.setState({
        images: isReload ? album_content_list : images.concat(album_content_list),
        lastSearchTime: last_search_time,
        hasMore: album_content_list.length == pageSize,
        hasMoreImageList: isReload ? false : hasMoreImageList,
        total,
      });
    }
    that.setState({
      isLoadingImageList: false,
    });

    return imageList;
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
  const { urls, qs, hotImages, isLoadingHotImageList, pageSize } = that.state;
  const baseUrl = urls.saasBaseUrl;
  const enc_broadcast_id = qs.enc_broadcast_id;
  let last_enc_album_content_rel_id = '';
  if (isLoadingHotImageList && !isReload) return;
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
    });
    if (data && data.ret_code == 200000) {
      that.setState({
        hotImages: hotImages.concat(data.data.album_content_list),
        hotImageTotal: data.data.total,
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

const getTimeSegmentGroup = async (that, isReload = false) => {
  const { urls, qs, hotImages, isLoadingTimeSegmentGroup, currentSortAsc } = that.state;
  const baseUrl = urls.saasBaseUrl;
  const enc_broadcast_id = qs.enc_broadcast_id;
  if (isLoadingTimeSegmentGroup && !isReload) return;
  try {
    that.setState({
      isLoadingTimeSegmentGroup: true,
    });
    const data = await service.getTimeSegmentGroup({
      baseUrl,
      enc_broadcast_id,
    });
    if (data && data.ret_code == 200000) {
      that.setState({
        timeSegmentGroup: currentSortAsc ? data.data.reverse() : data.data,
      });
    }
    that.setState({
      isLoadingTimeSegmentGroup: false,
    });
  } catch (e) {
    that.setState({
      isLoadingTimeSegmentGroup: false,
    });
    console.error(e);
  }
};

const getContentListByTimeSegment = async that => {
  const {
    urls,
    qs,
    isLoadingContentListByTimeSegment,
    currentSortAsc,
    pageSize,
    currentTimeSegment,
    timeSegmentGroup,
  } = that.state;
  const { broadcastActivity } = that.props;
  const { begin_time, end_time, images } = currentTimeSegment;
  const baseUrl = urls.saasBaseUrl;
  const enc_broadcast_id = qs.enc_broadcast_id;
  const is_asc = currentSortAsc;
  let last_enc_album_content_rel_id = '';
  let last_shot_time = ''; // 每一页的最后的那条数据的拍摄时间
  let last_repeat_album_content_rel_id = ''; // 需要判断最后的shot_time是否还有重复的，如果有把对应的 last_enc_album_content_rel_id 都传过来
  const sort_type = broadcastActivity.get('sort_type'); // 新增直播间排序方式
  if (isLoadingContentListByTimeSegment) return;
  if (images && images.length > 0) {
    last_enc_album_content_rel_id = images[images.length - 1].enc_album_content_rel_id;
    const { lastShotTime, lastRepeatAlbumContentRelId } = getLastInfoByList(images);
    last_shot_time = lastShotTime;
    last_repeat_album_content_rel_id = lastRepeatAlbumContentRelId;
  }
  try {
    that.setState({
      isLoadingContentListByTimeSegment: true,
    });
    const data = await service.getContentListByTimeSegment({
      baseUrl,
      enc_broadcast_id,
      begin_time,
      end_time,
      last_enc_album_content_rel_id,
      page_size: pageSize,
      is_asc,
      sort_type, // 新增直播间排序方式
      last_shot_time, // 每一页的最后的那条数据的拍摄时间
      last_repeat_album_content_rel_id, // 需要判断最后的shot_time是否还有重复的，如果有把对应的 last_enc_album_content_rel_id 都传过来
    });
    if (data && data.ret_code == 200000) {
      const { album_content_list, last_search_time, total } = data.data;
      currentTimeSegment.images = images ? images.concat(album_content_list) : album_content_list;
      currentTimeSegment.hasMore = album_content_list.length == pageSize;
      currentTimeSegment.total = total;
    }
    that.setState({
      isLoadingContentListByTimeSegment: false,
      currentTimeSegment: currentTimeSegment,
      timeSegmentGroup: timeSegmentGroup,
    });
  } catch (e) {
    that.setState({
      isLoadingContentListByTimeSegment: false,
    });
    console.error(e);
  }
};

/**
 * 直播间的访问
 */
const albumViewOperation = async that => {
  const { urls, qs } = that.state;
  const { userInfo } = that.props;
  const baseUrl = urls.saasBaseUrl;
  const enc_broadcast_id = qs.enc_broadcast_id;
  const user_unique_id = userInfo.get('user_id');
  try {
    await service.logTargetOperation({
      baseUrl,
      enc_broadcast_id,
      target_type: '1',
      action_type: '1',
      enc_target_id: enc_broadcast_id,
      user_unique_id,
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * 获取直播间的访问统计数据
 */
const getAlbumView = async that => {
  const { urls, qs } = that.state;
  const baseUrl = urls.saasBaseUrl;
  const enc_broadcast_id = qs.enc_broadcast_id;
  try {
    const data = await service.getTargetOperationCount({
      baseUrl,
      enc_broadcast_id,
      target_type: '1',
      action_type: '1',
      enc_target_id: enc_broadcast_id,
    });
    if (data && data.ret_code == 200000) {
      that.setState({
        albumViewData: data.data,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * 获取直播间是否有新数据
 */
const hasUpdate = async that => {
  const { urls, qs, lastSearchTime } = that.state;
  const baseUrl = urls.saasBaseUrl;
  const enc_broadcast_id = qs.enc_broadcast_id;
  try {
    const data = await service.hasUpdate({
      baseUrl,
      enc_broadcast_id,
      begin_time: lastSearchTime,
    });
    if (data && data.ret_code == 200000) {
      that.setState({
        hasMoreImageList: data.data,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

export default {
  getContentList,
  getHotContentList,
  getTimeSegmentGroup,
  getContentListByTimeSegment,
  albumViewOperation,
  getAlbumView,
  hasUpdate,
};
