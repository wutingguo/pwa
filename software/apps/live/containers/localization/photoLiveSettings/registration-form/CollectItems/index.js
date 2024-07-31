import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { del_form_field } from '@apps/live/services/photoLiveSettings';

import DeleteModal from '../DeleteModal';
import move from '../imgs/move.png';
import { deleteMessage } from '../opts';

import { Container, Content, MenuItem, MenuList, MoveIcon, Tip } from './layout';

/**
 * 客资收集项
 * @typedef {Object} CollectItemsProps
 * @property {Array} value 客资收集项数组
 * @property {Function} onChange 客资收集项数组变化回调
 * @property {Function} onEdit 编辑回调
 * @property {number} selected 选中的项
 * @property {Function} onSelect 点击项事件
 * @property {string} baseUrl baseUrl
 * @property {string} encAlbumId 相册加密id
 * @property {Function} onDeleteSuccess 删除成功回调-需要刷新查看客资名单接口
 * @param {CollectItemsProps} props
 */
const CollectItems = props => {
  const { value, onChange, onEdit, selected, onSelect, baseUrl, encAlbumId, onDeleteSuccess } =
    props;
  const data = cloneDeep(value || []);
  // 删除弹窗显隐
  const [visible, setVisible] = useState(false);
  // 删除记录
  const [record, setRecord] = useState({});

  /**
   * 移动数据项
   */
  const onDragEnd = result => {
    const { source, destination } = result;
    const { index: targetIndex } = destination;
    const sourceIndex = source.index;
    const sourceKey = data.splice(sourceIndex, 1)[0];

    if (targetIndex === 0) {
      data.unshift(sourceKey);
    } else if (targetIndex === data.length) {
      data.push(sourceKey);
    } else {
      data.splice(targetIndex, 0, sourceKey);
    }

    // 更新数据-改变field_order的排序
    const newData = data.map((item, index) => ({
      ...item,
      field_order: index + 1,
    }));
    onChange?.(newData);
  };

  /**
   * 删除收集项
   * @param {Object} task 当前收集项记录
   */
  const handleDelete = task => {
    setVisible(true);
    setRecord(task);
  };

  /**
   * 删除确认
   * 当有uidpk时掉接口删除
   * 当没有uidpk时本地删除
   */
  const onDelete = async e => {
    e.preventDefault(); // 阻止默认事件，点击透传到表单的submit事件
    const { uidpk, id } = record;
    if (uidpk) {
      const params = {
        baseUrl,
        enc_album_id: encAlbumId,
        field_id: uidpk,
      };
      await del_form_field(params);
      onDeleteSuccess?.();
    }
    const newData = data.filter(item => item.id !== id);
    onChange?.(newData);
    setVisible(false);
  };

  return (
    <Container>
      <Tip>带“*”表示必填项</Tip>
      <MenuList>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="collect-item">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {data.map((task, index) => (
                  <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                    {provide => (
                      <MenuItem
                        ref={provide.innerRef}
                        {...provide.draggableProps}
                        className={classNames({ current: selected === task.id })}
                        onClick={() => onSelect?.(task.id)}
                      >
                        <MoveIcon {...provide.dragHandleProps}>
                          <div
                            className={classNames({
                              current: selected === task.id,
                            })}
                          >
                            <img src={move} />
                          </div>
                        </MoveIcon>
                        <Content>
                          <div className="text">
                            <span>{task.field_name}</span>
                            {task.required === 1 && <span className="required">*</span>}
                          </div>
                          {selected === task.id && (
                            <span className="edit" onClick={() => onEdit?.(task)}>
                              编辑
                            </span>
                          )}
                          {selected === task.id && (
                            <span className="delete" onClick={() => handleDelete(task)}>
                              删除
                            </span>
                          )}
                        </Content>
                      </MenuItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </MenuList>
      {/* 删除弹窗 */}
      {visible && (
        <DeleteModal title={deleteMessage} onClose={() => setVisible(false)} onDelete={onDelete} />
      )}
    </Container>
  );
};

export default CollectItems;
