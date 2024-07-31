import { bookShapeTypes } from '../constants/strings';

export const checkBookShapeType = productSize => {
  const { width, height } = productSize;
  let type;
  if (width === height) {
    type = bookShapeTypes.square;
  } else if (width > height) {
    type = bookShapeTypes.portrait;
  } else {
    type = bookShapeTypes.landscape;
  }
  return type;
};
