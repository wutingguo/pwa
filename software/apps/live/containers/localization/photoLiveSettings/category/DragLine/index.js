import React from 'react';

import FButton from '@apps/live/components/FButton';
import move from '@apps/live/static/icons/move.png';

import { Container, Content, MoveIcon } from './layout';

export default function DragLine(props) {
  const { record, provided, handleClick, intl } = props;

  const hidenText =
    record?.visible_status === 0 ? intl.tf('LP_CATEGORY_SHOW') : intl.tf('LP_CATEGORY_HIDDEN');

  return (
    <Container ref={provided.innerRef} {...provided.draggableProps}>
      <MoveIcon MoveIcon {...provided.dragHandleProps}>
        <div className="current">
          <img src={move} />
        </div>
      </MoveIcon>
      <Content>
        <div className="name">{record.category_name}</div>
        <div>
          {record?.category_type === 2 ? (
            <FButton
              onClick={() => handleClick('edit', record)}
              type="link"
              color="#0077CC"
              style={{ padding: '0px 10px 0px 0px' }}
            >
              {intl.tf('LP_CATEGORY_Edit')}
            </FButton>
          ) : null}
          <FButton
            onClick={() => handleClick('hide', record)}
            type="link"
            color="#0077CC"
            style={{ padding: '0px 10px 0px 0px' }}
          >
            {hidenText}
          </FButton>
          {record?.category_type === 2 ? (
            <FButton
              onClick={() => handleClick('delete', record)}
              type="link"
              color="#0077CC"
              style={{ padding: '0px 10px 0px 0px' }}
            >
              {intl.tf('LP_CATEGORY_CANCEL_DELETE')}
            </FButton>
          ) : null}
        </div>
      </Content>
    </Container>
  );
}
