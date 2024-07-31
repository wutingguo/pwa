import React from 'react';

import emptySrcEn from './images/empty-en.png';
import emptySrc from './images/empty.png';

export default function Empty(props) {
  const { style } = props;

  const src = __isCN__ ? emptySrc : emptySrcEn;
  const _style = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${src})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    ...style,
  };
  return <div style={_style}></div>;
}
