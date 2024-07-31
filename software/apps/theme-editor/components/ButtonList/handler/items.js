import classNames from 'classnames';
import React from 'react';

import { elementTypes } from '@resource/lib/constants/strings';

export function getItems(that) {
  const { pageArray, page, selectElementIds, undoData, boundProjectActions } = that.props;
  const isSingleSelect = selectElementIds.length && selectElementIds.length === 1;
  const elements = page.get('elements');
  const isMultiSelect = selectElementIds.length > 1;
  const firstSelectElement = isSingleSelect
    ? elements.find(ele => ele.get('id') === selectElementIds[0])
    : null;
  const firstElementType = firstSelectElement && firstSelectElement.get('type');
  const isSinglePhotoFrame = firstElementType && firstElementType === elementTypes.photo;
  let frameStatus = isSinglePhotoFrame;
  if (isMultiSelect) {
    const isFullPhotoFrame = selectElementIds.every(id => {
      const element = elements.find(ele => ele.get('id') === id);
      const elementType = element && element.get('type');
      return elementType === elementTypes.photo;
    });
    frameStatus = isFullPhotoFrame || isSinglePhotoFrame;
  }
  const items = [
    {
      name: 'set-photo',
      title: frameStatus ? '取消照片框' : '设为照片框',
      disabled: !(isSingleSelect || isMultiSelect),
      isShow: true,
      handler: () => that.setPhotoElement(frameStatus),
    },
    {
      name: 'undo',
      title: '撤销',
      isShow: true,
      disabled: !undoData.pastCount,
      handler: boundProjectActions.undo,
      icon: true,
    },
    {
      name: 'redo',
      title: '恢复',
      isShow: true,
      disabled: !undoData.futureCount,
      handler: boundProjectActions.redo,
      icon: true,
    },
  ];
  return items;
}

export function getRenderItems(that) {
  const items = that.getItems();
  return items.map((item, index) => {
    const { name, title, handler, disabled, isShow, icon } = item;
    if (!isShow) {
      return null;
    }
    const className = classNames('action-item', {
      disabled,
      [name]: name,
    });
    return (
      <li key={name} id={`#${name}`} onClick={handler} className={className}>
        {icon ? <i className="icon" /> : null}
        {title}
      </li>
    );
  });
}
