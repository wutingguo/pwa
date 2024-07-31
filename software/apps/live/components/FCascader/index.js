import React from 'react';

import Cascader from '@common/components/CascaderNew';

import { Container } from './layout';

export default function FCascader(props) {
  const { estoreBaseUrl, value, onChange, placeholder, changeType, style, needMapStateToProps } =
    props;

  function selectComplete(obj) {
    const { street, streets, ...rest } = obj;
    onChange && onChange({ ...rest });
  }
  return (
    <Container>
      <Cascader
        {...value}
        placeholder={placeholder}
        estoreBaseUrl={estoreBaseUrl}
        selectComplete={selectComplete}
        changeType={changeType}
        style={style}
        needMapStateToProps={needMapStateToProps}
      />
    </Container>
  );
}
