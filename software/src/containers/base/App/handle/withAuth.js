import React from 'react';
import XNotLogged from '@resource/components/pwa/XNotLogged';

export default Comp => {
  return props => {
    const { isLogined } = props;

    if (isLogined) {
      return <Comp {...props} />;
    }

    return <XNotLogged />;
  };
};
