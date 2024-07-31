import { noSelectElementTypes } from '../../../constants/strings';

export function onClick(that, e) {
  const { element, pageActions } = that.props;
  if (noSelectElementTypes.includes(element.get('type'))) {
    return;
  }
  pageActions.selectElement(element.get('id'), e);
  e.cancelBubble = true;
}

export function dragBoundFunc(that, pos, e) {
  const { ratio } = that.props;
  let { x, y } = pos;

  const startX = that.startDragPosition.x * ratio;
  const startY = that.startDragPosition.y * ratio;

  // shift键控制 水平或者垂直移动
  const isShiftPressed = e.shiftKey;
  if (isShiftPressed) {
    const deltaX = Math.abs(x - startX);
    const deltaY = Math.abs(y - startY);
    if (typeof that.isVerticalDirection === 'undefined') {
      that.isVerticalDirection = true;
      if (deltaX > deltaY) {
        that.isVerticalDirection = false;
      }
    }
    if (that.isVerticalDirection) {
      x = startX;
    } else {
      y = startY;
    }
  }

  return {
    x,
    y
  };
}

export function onDragStart(that, e) {
  that.startDragPosition = {
    x: e.target.x(),
    y: e.target.y()
  };
  that.setState({ isTransforming: true });
}

export function onDragEnd(that, e) {
  const { element, boundProjectActions } = that.props;
  delete that.isVerticalDirection;
  that.setState({ isTransforming: false });
  if (that.node) {
    const offset = that.node.offset();
    const x = Math.round(that.node.x() - offset.x);
    const y = Math.round(that.node.y() - offset.y);
    boundProjectActions.updateElement({
      id: element.get('id'),
      x,
      y
    });
  }
}

export function onTransformStart(that) {
  that.setState({ isTransforming: true });
}

export function onTransformEnd(that, e) {
  const { element, boundProjectActions } = that.props;
  that.setState({ isTransforming: false });
  if (that.node) {
    const rotation = that.node.rotation();
    const width = Math.round(element.get('width') * that.node.scaleX());
    const height = Math.round(element.get('height') * that.node.scaleY());
    const x = Math.round(that.node.x() - Math.round(width / 2));
    const y = Math.round(that.node.y() - Math.round(height / 2));
    boundProjectActions.updateElement({
      id: element.get('id'),
      x,
      y,
      width,
      height,
      rot: rotation
    });
    that.node.scale({ x: 1, y: 1 });
  }
}
