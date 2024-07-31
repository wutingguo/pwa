import { get } from 'lodash';

/**
 *
 * @param {*} that
 */
const onShare = that => {
  const {
    history: { push },
    params: { id }
  } = that.props;
  push(`/software/gallery/share/${id}`);
};

/**
 *
 * @param {*} that
 */
const onView = that => {
  // 链接带替换
  window.open('https://www.zno.com');
};

/**
 *
 * @param {*} that
 * @param {*} files
 */
const onAddImages = (that, files) => {
  const { boundProjectActions } = that.props;
  logEvent.addPageEvent({
    name: 'AiPhotosCollection_Click_AddPhotos'
  });
  boundProjectActions.addImages(files);
};

export default {
  onShare,
  onView,
  onAddImages
};
