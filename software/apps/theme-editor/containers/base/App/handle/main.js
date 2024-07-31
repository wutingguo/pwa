const onBeforePageUnload = e => {
  e.preventDefault();
  e.returnValue = '请注意：您当前编辑的数据将会丢失';
};

const removeBeforeUnload = () => {
  window.removeEventListener('beforeunload', onBeforePageUnload);
};

const willMount = that => {
  const { pageArray } = that.props;
  if (!pageArray.size) {
    history.replaceState({}, '', '/software/designer/my-materials');
  }
};

const didMount = that => {
  window.addEventListener('resize', that.onresize);
  window.addEventListener('beforeunload', onBeforePageUnload);
  window.removeBeforeUnload = removeBeforeUnload;
  that.onresize();
};

const willUnmount = that => {
  window.removeEventListener('resize', that.onresize);
  removeBeforeUnload();
};

const didUpdate = that => {};

export { willMount, didMount, willUnmount, didUpdate };
