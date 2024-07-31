const MIN_LENGTH = 5;

export function onTransform(that, e) {}

export function onTransformEnd(that, e) {
  // NOTICE: 很重要，这段代码代码用于处理多选情况下元素上transformEnd事件只触发一次的问题
  if (that.transformer) {
    const nodes = that.transformer.nodes();
    nodes.forEach(node => node.fire('transformend'));
  }
}

export function boundBoxFunc(that, oldBox, newBox) {
  if (newBox.width < MIN_LENGTH || newBox.height < MIN_LENGTH) {
    return oldBox;
  }
  return newBox;
}
