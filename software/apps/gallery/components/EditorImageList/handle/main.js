/**
 *
 * @param {*} that
 * @param {*} files
 */
const onAddImages = (that, files) => {
  const { boundProjectActions } = that.props;
  that.setState({
    files,
  });
  // boundProjectActions.addImages(files)
};

/**
 * 对卡片进行重新排序.
 * @param {*} that
 * @param {string} dragEncImgId 被拖拽的元素所在的图片id.
 * @param {string} dropEncImgId 目标区域的元素的图片id.
 */
const resortImages = (that, { dragEncImgId, dropEncImgId }) => {
  const { collectionDetail } = that.props;

  const images = collectionDetail.get('images');
  const selectedImgUidList = collectionDetail.getIn(['photos', 'selectedImgUidList']).toJS();

  const dragUidList = selectedImgUidList.includes(dragEncImgId)
    ? selectedImgUidList
    : [dragEncImgId];
  const insertIndex = images.findIndex(i => dropEncImgId === i.get('enc_image_uid'));

  resortImagesFunc(that, insertIndex, dragUidList);
};
/**
 * 对卡片进行重新排序. 公共方法
 * @param {*} that
 * @param {string} insertIndex 插入的位置.
 * @param {string} dragUidList 需要排序的item.
 */
const resortImagesFunc = (that, insertIndex, dragUidList) => {
  const { boundProjectActions, collectionDetail } = that.props;

  const images = collectionDetail.get('images');
  const dragList = images.filter(i => dragUidList.includes(i.get('enc_image_uid')));
  const filterList = images.filter(i => !dragUidList.includes(i.get('enc_image_uid')));

  const sortImageList = filterList.splice(insertIndex, 0, ...dragList.toArray());
  const sortUidList = sortImageList.map(i => i.get('enc_image_uid'));

  boundProjectActions.resortImages(sortImageList);
  boundProjectActions.postResortImages(sortUidList);
  boundProjectActions.handleClearSelectImg();
};

export default {
  onAddImages,
  resortImages,
  resortImagesFunc,
};
