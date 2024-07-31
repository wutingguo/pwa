export function selectElement(that, elementId, e) {
  const { onSelectElements } = that.props;
  const { selectElementIds } = that.state;
  const { ctrlKey, metaKey } = e.evt;
  // const isMultiSelect = false;
  const isMultiSelect = ctrlKey || metaKey;
  const newSelectedElementIds = isMultiSelect
    ? Array.from(new Set([...selectElementIds, elementId]))
    : [elementId];
  that.setState({ selectElementIds: newSelectedElementIds });
  onSelectElements && onSelectElements(newSelectedElementIds);
}

export function unSelectElements(that, e) {
  const { onSelectElements } = that.props;
  that.setState({ selectElementIds: [] });
  onSelectElements && onSelectElements([]);
}
