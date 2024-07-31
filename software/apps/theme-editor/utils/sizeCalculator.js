export const getSpreadSize = pageArray => {
  const size = {
    width: 0,
    height: 0
  };
  let bleed = { top: 0, left: 0, right: 0, bottom: 0 };

  const firstPage = pageArray.get(0);

  const newBleed = firstPage.get('bleed');
  if (newBleed) {
    bleed = newBleed.toJS();
  }

  size.width = firstPage.get('width');
  size.height = firstPage.get('height');
  size.width = Math.ceil(size.width);
  size.height = Math.ceil(size.height);
  size.bleed = bleed;

  return size;
};

export const getRenderSize = () => {};
