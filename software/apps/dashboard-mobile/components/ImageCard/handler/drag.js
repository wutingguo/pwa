/* ---------被拖拽的元素事件-------- */
const onDragStarted = (that, event) => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsChoosePhotos_Click_ChangeOder',
  });

  const { item } = that.props;
  const ev = event || window.event;

  const encImgId = item.get('encImgId');
  ev.dataTransfer.setData('encImgId', encImgId);
};

const onDragEnded = (that, event) => {
  const { changeDragEnteredId } = that.props;
  changeDragEnteredId('');
};

/* -------被拖拽的元素事件---------- */
const onDroped = (that, event) => {
  const { item, resortImages, changeDragEnteredId } = that.props;

  const dragEncImgId = event.dataTransfer.getData('encImgId');
  const dropEncImgId = item.get('encImgId');

  resortImages({ dragEncImgId, dropEncImgId });
  changeDragEnteredId('');
};

const onDragEntered = (that, event) => {
  const { item, changeDragEnteredId } = that.props;
  const dropEncImgId = item.get('encImgId');
  changeDragEnteredId(dropEncImgId);
};

const onDragLeaved = (that, event) => {
  // that.setState({
  //   isDragEnter: false
  // });
};

const onDraging = (that, event) => {
  const { cardListNode } = that.props;
  if (event.y >= window.innerHeight - 20) {
    cardListNode.scrollTop += 20;
  }
  if (event.y <= 90) {
    cardListNode.scrollTop -= 20;
  }
};

export default {
  // 被拖拽的元素事件.
  onDragStarted,
  onDragEnded,

  // 目标释放位置的元素事件.
  onDragEntered,
  onDragLeaved,
  onDroped,
  onDraging,
};
