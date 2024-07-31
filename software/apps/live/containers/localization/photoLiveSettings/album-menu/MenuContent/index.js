import React from 'react';

import MenuCard from './MenuCard';
import MenuList from './MenuList';
import { Container, Left, Right } from './layout';

function MenuContent(props, myRef) {
  const { data, onChange, save, isChange } = props;
  const task = data[data.column.current] || {};
  return (
    <Container>
      <Left>
        <MenuList data={data} onChange={onChange} save={save} isChange={isChange} />
      </Left>
      <Right>
        <MenuCard ref={myRef} data={data} onChange={onChange} save={save} task={task} />
      </Right>
    </Container>
  );
}
export default React.forwardRef(MenuContent);
