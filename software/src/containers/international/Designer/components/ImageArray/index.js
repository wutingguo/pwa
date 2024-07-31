import classNames from 'classnames';
import React, { Component, Fragment } from 'react';

// 公共组件
import XPureComponent from '@resource/components/XPureComponent';

import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';

// 自定义组件
import XImageItem from '../ImageItem';

import './index.scss';

// via.placeholder.com/145x96
class ImageArray extends XPureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { list = [], className = '', type, handlerClick } = this.props;
    const wrapCls = classNames('image-list', className);
    return (
      <div className={wrapCls}>
        {Array.isArray(list) &&
          list.map(imgItem => {
            const style = getOrientationAppliedStyle(imgItem.orientation);
            return (
              <XImageItem
                key={imgItem.src}
                type={type}
                onClick={handlerClick}
                desc={imgItem.desc}
                disabled={imgItem.disabled}
                src={imgItem.src}
                active={imgItem.active}
                style={style}
                item={imgItem}
              />
            );
          })}
      </div>
    );
  }
}

export default ImageArray;
