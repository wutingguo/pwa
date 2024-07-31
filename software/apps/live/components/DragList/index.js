import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

/**
 *
 * @typedef {object} DragListProps
 * @property {string} id
 * @property {Array<any>} items
 * @property {Function} onDragEnd
 * @property {string} className
 * @property {object} style
 * @property {(provided, record) => import('react').ReactElement | String} customRender
 * @param {DragListProps} props
 * @returns {React.ReactElement}
 */
export default function DragList(props) {
  const { id, items, onDragEnd, className, style, customRender } = props;
  function handleDragend(res) {
    onDragEnd?.(res);
  }
  return (
    <div className={className} style={style}>
      <DragDropContext onDragEnd={handleDragend}>
        <Droppable droppableId={id}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) => (
                <DragItem
                  key={item.id}
                  id={item.id + ''}
                  index={index}
                  isDragDisabled={item.isDragDisabled}
                  item={item}
                  customRender={customRender}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

function DragItem(props) {
  const { id, index, customRender, item, ...rest } = props;
  return (
    <Draggable key={id} draggableId={id} index={index} {...rest}>
      {provided => (
        <>
          {typeof customRender !== 'function' ? (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              {item?.content}
            </div>
          ) : (
            customRender(provided, item)
          )}
        </>
      )}
    </Draggable>
  );
}
