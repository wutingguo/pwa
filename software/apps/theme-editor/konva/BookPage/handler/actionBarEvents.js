import Immutable from 'immutable';
import { elementTypes } from '@resource/lib/constants/strings';
import { collision } from '@resource/lib/utils/collision';

const findMixed = (elements, element) => {
  let mixed = Immutable.List();
  const source = {
    x: element.get('x'),
    y: element.get('y'),
    width: element.get('width'),
    height: element.get('height'),
    rot: element.get('rot')
  };
  elements.forEach(item => {
    const target = {
      x: item.get('x'),
      y: item.get('y'),
      width: item.get('width'),
      height: item.get('height'),
      rot: item.get('rot')
    };
    const isCollapsed = collision(source, target);
    if (item.get('id') !== element.get('id') && isCollapsed) {
      mixed = mixed.push(item);
    }
  });
  return mixed;
};

export function removeElement(that, e) {
  const { page, boundProjectActions } = that.props;
  const { selectElementIds } = that.state;
  boundProjectActions.deleteElement(selectElementIds[0], page.get('id'));
}

export const onBringToFront = (that, element, e) => {
  const { page, boundProjectActions } = that.props;
  const elements = page.get('elements');

  const newElements = elements.filter(
    ele => ele.get('type') !== elementTypes.background && ele.get('id') !== element.get('id')
  );

  // 层级高于当前元素的元素
  const elementsUp = newElements.filter(item => {
    return item.get('depth') >= element.get('depth');
  });
  // 找到当前元素并且与相交的元素
  const mixed = findMixed(elementsUp, element);
  // 找到相交元素中离当前元素最近的元素A
  const nearest = mixed.maxBy(item => {
    return item.get('depth');
  });

  if (nearest) {
    boundProjectActions.updateElement({
      id: element.get('id'),
      depth: nearest.get('depth') + 1
    });
  }
};

export const onSendToback = (that, element, e) => {
  const { page, boundProjectActions } = that.props;
  const elements = page.get('elements');

  const newElements = elements.filter(
    ele => ele.get('type') !== elementTypes.background && ele.get('id') !== element.get('id')
  );

  // 层级低于当前元素的元素
  const elementsDown = newElements.filter(item => {
    return item.get('depth') <= element.get('depth');
  });

  // 找到层级低于当前元素并且与相交的元素
  const mixed = findMixed(elementsDown, element);

  // 找到相交元素中离当前元素最近的元素A
  const nearest = mixed.minBy(item => {
    return item.get('depth');
  });

  if (nearest) {
    boundProjectActions.updateElement({
      id: element.get('id'),
      depth: nearest.get('depth') - 1
    });
  }
};

export const onBringForward = (that, element, e) => {
  const { page, boundProjectActions } = that.props;
  const elements = page.get('elements');

  const newElements = elements.filter(
    ele => ele.get('type') !== elementTypes.background && ele.get('id') !== element.get('id')
  );
  // 层级高于当前元素的元素
  const elementsUp = newElements.filter(item => {
    return item.get('depth') >= element.get('depth');
  });
  const mixed = findMixed(elementsUp, element);
  const nearest = mixed.minBy(item => {
    return item.get('depth');
  });
  if (nearest) {
    boundProjectActions.updateElement({
      id: element.get('id'),
      depth: nearest.get('depth') + 1
    });
  }
};

export const onSendBackward = (that, element, e) => {
  const { page, boundProjectActions } = that.props;
  const elements = page.get('elements');

  const newElements = elements.filter(
    ele => ele.get('type') !== elementTypes.background && ele.get('id') !== element.get('id')
  );
  // 层级低于当前元素的元素
  const elementsDown = newElements.filter(item => {
    return item.get('depth') <= element.get('depth');
  });
  // 找到层级低于当前元素并且与相交的元素
  const mixed = findMixed(elementsDown, element);
  // 找到相交元素中离当前元素最近的元素A
  const nearest = mixed.maxBy(item => {
    return item.get('depth');
  });
  if (nearest) {
    boundProjectActions.updateElement({
      id: element.get('id'),
      depth: nearest.get('depth') - 1
    });
  }
};
