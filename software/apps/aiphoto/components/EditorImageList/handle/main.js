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
  onAddImages
};
