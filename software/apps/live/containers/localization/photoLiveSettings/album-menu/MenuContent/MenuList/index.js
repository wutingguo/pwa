import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import XButton from '@resource/components/XButton';

import MenuItem from './MenuItem';
import sort from './icons/sort.png';

const Container = styled.div`
  width: 340px;
  overflowy: auto;
  height: 140px;
`;

export default function MenuList(props) {
  const { data, onChange, save, isChange } = props;
  const { column } = data;
  const tasks = column.tasks.map(name => data[name]);

  /**
   * 任务内容修改
   * @param {*} task
   */
  function taskChange(task) {
    data[task.id] = task;
    onChange({ ...data });
  }

  /**
   * 选中任务修改
   * @param {*} id
   */
  function itemClick(id) {
    data.column.current = id;
    onChange({ ...data });
  }
  /**
   * 移动项数据更新
   * @param {*} result
   */
  function onDragEnd(result) {
    // console.log('onDragEnd', result);
    const { source, destination } = result;
    const { index: targetIndex } = destination;
    const sourceIndex = source.index;
    const sourceKey = column.tasks.splice(sourceIndex, 1)[0];

    if (targetIndex === 0) {
      column.tasks.unshift(sourceKey);
    } else if (targetIndex === column.tasks.length) {
      column.tasks.push(sourceKey);
    } else {
      column.tasks.splice(targetIndex, 0, sourceKey);
    }
    column.tasks.forEach((key, index) => {
      data[key].order = index;
    });

    onChange({ ...data });
  }
  // console.log('column', column);
  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={column.id}>
          {provided => {
            return (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((task, index) => (
                  <MenuItem
                    isCurrent={column.current === task.id}
                    itemClick={itemClick}
                    key={task.id}
                    id={task.id}
                    task={task}
                    index={index}
                    taskChange={taskChange}
                  />
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
      {/* <XButton
        disabled={!isChange}
        style={{ marginTop: 40, width: '100%', height: 48 }}
        onClick={save}
      >
        <img style={{ marginRight: '5px', width: '16px', marginTop: -2 }} src={sort} />
        <span style={{ fontSize: 16 }}>保存排序</span>
      </XButton> */}
    </Container>
  );
}
