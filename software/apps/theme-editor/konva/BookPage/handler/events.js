const moveDelta = 1;

export function moveElements(that, { x = 0, y = 0 }) {
  const { selectElementIds } = that.state;
  if (that.stage) {
    selectElementIds.forEach(id => {
      const node = that.stage.findOne(`#${id}`);
      const absPos = node.absolutePosition();
      if (x) {
        absPos.x += x;
      }
      if (y) {
        absPos.y += y;
      }
      node.absolutePosition(absPos);
      that.guidelines.onSnapGuideLine(node, false);
      // NOTICE：很重要 用于触发元素内部的区域限制逻辑
      const event = {
        type: 'dragmove',
        target: node,
        currentTarget: node,
        forceMove: true
      };
      node.fire(event.type, event);

      // 用于触发元素更新逻辑
      node.timer && clearTimeout(node.timer);
      node.timer = setTimeout(() => {
        event.type = 'dragend';
        node.fire(event.type, event);
        clearTimeout(node.timer);
        node.timer = null;
      }, 0);
    });
    const timer = setTimeout(() => {
      that.layerEvents.onDragEnd();
      clearTimeout(timer);
    }, 500);
  }
}

export function onKeyDown(that, e) {
  const { keyCode } = e;
  switch (keyCode) {
    case 37:
      return that.events.moveElements({ x: -moveDelta });
    case 38:
      return that.events.moveElements({ y: -moveDelta });
    case 39:
      return that.events.moveElements({ x: moveDelta });
    case 40:
      return that.events.moveElements({ y: moveDelta });
    default:
      break;
  }
}

export function addListeners(that) {
  window.addEventListener('keydown', that.events.onKeyDown);
  window.addEventListener('click', that.pageActions.unSelectElements);
}

export function removeListeners(that) {
  window.removeEventListener('keydown', that.events.onKeyDown);
  window.removeEventListener('click', that.pageActions.unSelectElements);
}
