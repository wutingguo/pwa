import useMessage from './index';
import React from 'react';

export default function createMessage() {
  return Wrapper => {
    return props => {
      const [placeholder, message] = useMessage();
      return (
        <>
          <Wrapper {...props} message={message} />
          {placeholder}
        </>
      );
    };
  };
}
