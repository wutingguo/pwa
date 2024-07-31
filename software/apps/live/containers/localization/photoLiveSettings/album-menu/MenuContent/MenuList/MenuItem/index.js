import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import Switch from '@apps/gallery/components/Switch';
import IconClose from '@apps/live/components/Icons/IconClose';

import move from '../icons/move.png';
import right from '../icons/right.png';

import { Container, Content, MoveIcon } from './layout';

const disabledList = ['broadcast'];
export default function MenuItem(props) {
  const { id, index, taskChange, task, itemClick, isCurrent } = props;

  function onSwitch(checked) {
    task.enable = checked;
    taskChange({ ...task });
  }
  return (
    <Draggable draggableId={id} index={index}>
      {provide => {
        return (
          <Container
            ref={provide.innerRef}
            {...provide.draggableProps}
            className={`${isCurrent ? 'current' : ''}`}
            onClick={() => itemClick(id)}
          >
            <MoveIcon {...provide.dragHandleProps}>
              <div className={`${isCurrent ? 'current' : ''}`}>
                <img src={move} />
              </div>
            </MoveIcon>
            <Content>
              <span className="text">{task.name}</span>
              <span className="iconR">
                <div className="switch" onClick={e => e.preventDefault()}>
                  <Switch
                    onSwitch={onSwitch}
                    isShowText={false}
                    checked={task.enable}
                    disabled={disabledList.includes(task.id)}
                  />
                </div>
                <span>
                  <img src={right} style={{ height: '100%' }} />
                </span>
              </span>
            </Content>
          </Container>
        );
      }}
    </Draggable>
  );
}
