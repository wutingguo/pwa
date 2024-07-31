import React from 'react';

import { useLanguage } from '@common/components/InternationalLanguage';

import BaseLine from './BaseLine';
import EditorLine from './EditorLine';
import { Container, Content, Title } from './layout';

function Card(props, myRef) {
  const { task, save, data, onChange } = props;
  const { intl, lang } = useLanguage();
  // console.log('taskid', task);

  const name = lang === 'cn' ? task.name : intl.tf('LP_RENAME');
  return (
    <Container>
      <Title>{name}</Title>
      <Content>
        {task?.id === 'introduce' ? (
          <EditorLine ref={myRef} task={task} save={save} data={data} onChange={onChange} />
        ) : (
          <BaseLine task={task} save={save} data={data} onChange={onChange} intl={intl} />
        )}
      </Content>
    </Container>
  );
}
export default React.forwardRef(Card);
