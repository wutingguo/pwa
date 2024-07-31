export function onDragMove(that, e) {
  that.guidelines.onSnapGuideLine(e.target);
}

export function onDragEnd(that) {
  that.setState({ hLines: [], vLines: [] });
}
