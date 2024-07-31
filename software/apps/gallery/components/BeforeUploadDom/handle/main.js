/**
 *
 * @param {*} that
 * @param {*} files
 */
// const onAddImages = (that, files) => {
//     const { boundProjectActions } = that.props;
//     // boundProjectActions.addImages(files);
//     that.setState({
//         files,
//     })
// };
const onEndAddImages = (that, watermarkValue) => {
  const { boundProjectActions, files } = that.props;
  files.forEach(item => {
    item.watermarkValue = watermarkValue;
  });
  boundProjectActions.addImages(files);
};
export default {
  onEndAddImages,
};
