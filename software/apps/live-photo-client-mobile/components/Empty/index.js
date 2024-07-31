import React from 'react';

import emptySrcEn from './images/empty-en.png';
import emptySrc from './images/empty.png';

export default function Empty(props) {
  const {} = props;
  const src = __isCN__ ? emptySrc : emptySrcEn;
  const style = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${src})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };
  return <div style={style}></div>;
}
