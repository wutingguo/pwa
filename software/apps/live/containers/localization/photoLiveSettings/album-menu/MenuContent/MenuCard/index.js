import React from 'react';
import styled from 'styled-components';

import { IntlConditionalDisplay } from '@common/components/InternationalLanguage';

import Card from './Card';
import Info from './Info';

const Container = styled.div`
  width: 468px;
`;

const TopElement = styled.div``;
const BottomElement = styled.div`
  margin-top: 10px;
  height: 520px;
`;
function MenuCard(props, myRef) {
  const { task, save, data, onChange } = props;
  return (
    <Container>
      <TopElement>
        <Card ref={myRef} task={task} save={save} data={data} onChange={onChange} />
      </TopElement>
      {task?.id === 'broadcast' ? (
        <IntlConditionalDisplay revels={['cn']}>
          <BottomElement>
            <Info />
          </BottomElement>
        </IntlConditionalDisplay>
      ) : null}
    </Container>
  );
}
export default React.forwardRef(MenuCard);
