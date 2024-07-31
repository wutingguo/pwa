import classNames from 'classnames';
import React from 'react';

import './index.scss';

const ImageItem = props => {
  const {
    type,
    item,
    src,
    active = false,
    disabled = false,
    desc = '',
    onClick = () => {},
    style,
  } = props;
  const wrapCls = classNames('img-item', {
    active: active,
    disabled: disabled,
  });

  return (
    <div className="img-box mb20 mr20" title={desc} onClick={() => onClick(type, item)}>
      <div className={wrapCls}>
        <img className="img" src={src} alt="图片" style={style} />
      </div>
      <p className="desc">{desc}</p>
    </div>
  );
};

export default ImageItem;
