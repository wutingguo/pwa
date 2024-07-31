import { fromJS, isImmutable } from 'immutable';
import React, { Component, memo, useEffect, useRef, useState } from 'react';

import Card from '@resource/components/pwa/XCard';

import './index.scss';

const CardListTimeSlice = props => {
  const { items, handleClick, handleEdit, handleDelete, renderCard, currentSetUid, style, ...res } =
    props;

  const [lists, setList] = useState([]);
  const [viewNum, setNum] = useState(0);
  const [setsTag, setSetsTag] = useState(false);
  const [oldList, setOldList] = useState(fromJS([]));
  const listRef = useRef(null);
  const fn = num => {
    const temp = num > items.size ? items : items.slice(0, num);
    setList(temp);
  };
  useEffect(() => {
    listRef.current.scrollTop = 0;
    setNum(40);
    setSetsTag(true);
  }, [currentSetUid]);
  useEffect(() => {
    setOldList(items);
    if (items.size !== oldList.size) {
      fn(40);
      listRef.current.scrollTop = 0;
    } else {
      // 当数量相同时
      if (setsTag) {
        fn(40);
        listRef.current.scrollTop = 0;
        setSetsTag(false);
      } else {
        setList(items.slice(0, viewNum));
      }
    }
  }, [items]);

  const callBack = () => {
    const domWrapper = listRef.current;
    const currentScroll = domWrapper.scrollTop; // 已经被卷掉的高度
    const clientHeight = domWrapper.offsetHeight; // 容器高度
    const scrollHeight = domWrapper.scrollHeight; // 内容总高度
    if (scrollHeight - 50 < currentScroll + clientHeight && items.size > viewNum) {
      fn(viewNum + 50);
      setNum(viewNum + 50 > items.size ? items.size : viewNum + 50);
    }
  };
  useEffect(() => {
    if (!listRef || !listRef.current) return;
    listRef.current.addEventListener('scroll', callBack);
    return () => {
      listRef.current.removeEventListener('scroll', callBack);
    };
  });
  return (
    <div className="cards-wrap" ref={listRef} style={style}>
      {lists.map(card => {
        if (renderCard) {
          return renderCard({
            key: card.get('enc_image_uid') || card.get('enc_collection_uid') || card.get('id'),
            item: card,
            handleClick,
            handleEdit,
            handleDelete,
            ...res,
          });
        }

        return (
          <Card
            key={card.id}
            card={card}
            handleClick={() => handleClick(card.id)}
            handleEdit={() => handleEdit(card.id)}
            handleDelete={() => handleDelete(card.id)}
          />
        );
      })}
    </div>
  );
};

export default memo(CardListTimeSlice);
