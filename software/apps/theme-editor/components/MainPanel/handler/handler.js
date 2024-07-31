export function onSelectElements(that, selectElementIds) {
  that.setState({
    selectElementIds
  });
}

export function goToPreviousPage(that) {
  const { boundProjectActions } = that.props;
  that.onSelectElements([]);
  boundProjectActions.prev();
}

export function goToNextPage(that) {
  const { boundProjectActions } = that.props;
  that.onSelectElements([]);
  boundProjectActions.next();
}

export function stopEvent(that, e) {
  e.stopPropagation();
}
