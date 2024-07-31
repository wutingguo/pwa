import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useLanguage } from '@common/components/InternationalLanguage';

import { useMessage } from '@common/hooks';

import DragList from '@apps/live/components/DragList';
import FButton from '@apps/live/components/FButton';
import Add from '@apps/live/components/Icons/Add';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import {
  getAlbumCategory,
  sortAlbumCategory,
  switchAlbumCategory,
} from '@apps/live/services/category';

import DeleteCategoryModal from './DeleteCategoryModal';
import DragLine from './DragLine';
import UpdateCategoryModal from './UpdateCategoryModal';
import { Container } from './layout';

export default function Category(props) {
  const { urls } = props;
  const { id } = useParams();
  const [placeholder, message] = useMessage();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [delModalVisible, setDelModalVisible] = useState(false);
  const [info, setInfo] = useState({
    record: null,
    type: 'add',
  });
  const baseUrl = urls?.get('galleryBaseUrl');

  const { intl } = useLanguage();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!id) return;
    queryCategory();
  }, [id]);

  async function onDragEnd(result) {
    const { destination, source } = result;
    // 如果没有有效的目标位置，直接返回
    if (!destination) return;
    // 如果拖放到了原来的位置，直接返回
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    // 重新排列项目顺序
    const items = Array.from(data);
    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);
    const index = destination.index;
    const sourceObj = items[index];
    const nextObj = items[index + 1];
    const prevObj = items[index - 1];
    const params = {
      baseUrl,
      current_id: sourceObj?.id,
      prev_id: prevObj?.id,
      next_id: nextObj?.id,
    };
    // 更新数据
    setData([...items]);
    await sortAlbumCategory(params);
  }

  async function handleHide(record) {
    const { id, visible_status } = record;
    if (visible_status === 1) {
      const visibleArr = data.filter(item => item.visible_status === 1 && item.id !== id);
      if (visibleArr.length < 1) return message.error(intl.tf('LP_MIN_CLASSIFICATION_LIMIT'));
    }
    const params = {
      baseUrl,
      category_id: id,
      status: visible_status === 0 ? 1 : 0,
    };
    await switchAlbumCategory(params);
    queryCategory();
  }
  function handleClick(type, record) {
    if (type === 'edit' || type === 'add') {
      setUpdateModalVisible(true);
    } else if (type === 'delete') {
      setDelModalVisible(true);
    } else if (type === 'hide') {
      return handleHide(record);
    }
    setInfo({
      record,
      type,
    });
  }

  async function queryCategory() {
    const res = await getAlbumCategory({ baseUrl, enc_album_id: id });
    const items = res.map(item => {
      if (item.category_type === 1) {
        return {
          ...item,
          category_name: intl.tf('LP_ALL_PHOTOS'),
        };
      }
      return { ...item, isDragDisabled: item.category_type === 1 };
    });
    // const items = res.map(item => ({ ...item }));
    // console.log('items', items);
    setData(items);
  }
  const hasCreate = data.length < 100;
  return (
    <WithHeaderComp title={intl.tf('LP_PICTRUE_CATEGORIES')}>
      <Container>
        <DragList
          className="drag_list"
          id="666"
          items={data}
          onDragEnd={onDragEnd}
          style={{ maxHeight: 500, overflowY: 'auto' }}
          customRender={(provided, record) => (
            <DragLine intl={intl} handleClick={handleClick} provided={provided} record={record} />
          )}
        />
        {hasCreate ? (
          <FButton className="btn_add" onClick={() => handleClick('add', null)}>
            <Add fill="#3a3a3a" className="icon" />
            <span>{intl.tf('LP_ADD_CLASSIFICATION')}</span>
          </FButton>
        ) : null}
        <UpdateCategoryModal
          type={info.type}
          record={info.record}
          open={updateModalVisible}
          intl={intl}
          onCancel={() => setUpdateModalVisible(false)}
          onOk={() => setUpdateModalVisible(false)}
          baseUrl={baseUrl}
          albumId={id}
          queryCategory={queryCategory}
          message={message}
        />
        <DeleteCategoryModal
          open={delModalVisible}
          record={info.record}
          intl={intl}
          onCancel={() => setDelModalVisible(false)}
          onOk={() => setDelModalVisible(false)}
          baseUrl={baseUrl}
          queryCategory={queryCategory}
        />
        {placeholder}
      </Container>
    </WithHeaderComp>
  );
}
