/**
 *
 * @param {*} that
 * @param {*} files
 */
const onAddImages = (that, files) => {
  const { boundProjectActions } = that.props;

  boundProjectActions.addImages(files);
};

/**
 * 对卡片进行重新排序.
 * @param {*} that
 * @param {string} dragGuid 被拖拽的元素所在的图片id.
 * @param {string} dropGuid 目标区域的元素的图片id.
 */
const resortFrames = (that, dragGuid, dropGuid) => {
  const { boundProjectActions } = that.props;
  const { stateFrameList } = that.state;

  boundProjectActions
    .resortFrames({
      frames: stateFrameList,
      dragGuid,
      dropGuid
    })
    .then(() => {
      // TODO: 保存数据以更新状态，并重新获取详情
      boundProjectActions.saveSlideshow();
    });
};

export default {
  onAddImages,
  resortFrames
};
