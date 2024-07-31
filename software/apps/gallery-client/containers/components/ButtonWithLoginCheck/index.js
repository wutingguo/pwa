import React, { memo, useCallback } from 'react';
import XButton from 'appsCommon/components/dom/XButton';

import { withLoginCheck } from '../../../hooks/useLogin';

const ButtonWithLoginCheck = memo(
  withLoginCheck(({ children, onClicked, loginCheck, ...rest }) => {
    const handleClick = useCallback(() => {
      loginCheck({ onPass: onClicked });
    }, [onClicked]);
    return (
      <XButton onClick={handleClick} {...rest}>
        {children}
      </XButton>
    );
  })
);

export default ButtonWithLoginCheck;
