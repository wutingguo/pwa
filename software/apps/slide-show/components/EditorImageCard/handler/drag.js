/* ---------被拖拽的元素事件-------- */
const onDragStarted = (that, event) => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsChoosePhotos_Click_ChangeOder'
  });

  const { item } = that.props;
  const ev = event || window.event;

  const guid = item.get('guid');
  ev.dataTransfer.setData('guid', guid);
};

const onDragEnded = (that, event) => {
  console.log('onDragEnded');
};

/* -------被拖拽的元素事件---------- */
const onDroped = (that, event) => {
  const { item, resortFrames } = that.props;

  const dragGuid = event.dataTransfer.getData('guid');
  const dropGuid = item.get('guid');

  resortFrames(dragGuid, dropGuid);

  that.setState({
    isDragEnter: false
  });
};

const onDragEntered = (that, event) => {
  that.setState({
    isDragEnter: true
  });
};

const onDragLeaved = (that, event) => {
  that.setState({
    isDragEnter: false
  });
};

export default {
  // 被拖拽的元素事件.
  onDragStarted,
  onDragEnded,

  // 目标释放位置的元素事件.
  onDragEntered,
  onDragLeaved,
  onDroped
};
