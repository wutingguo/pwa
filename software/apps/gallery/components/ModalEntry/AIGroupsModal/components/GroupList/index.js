import React, { useState } from 'react';

import backPng from '@resource/static/icons/handleIcon/back_1.png';

import { EnterType } from '../../constant';

import ItemSection from './ItemSection';

import './index.scss';

const GroupList = props => {
  const { closeModal, group, count, enterType } = props;
  const firstType = group[0] && group[0]['groupId'] === 'fresh';
  return (
    <div className="ai_group_list">
      {EnterType[enterType] !== EnterType['galleryClient'] && (
        <div className="group_list_header">
          <div className="back" onClick={closeModal}>
            <img src={backPng} />
            <span>返回</span>
          </div>
        </div>
      )}
      <div className="headline">人像区（{count}）</div>
      <div className="list_content">
        {group.map((item, index) => (
          <ItemSection
            key={`${item.groupId}-${item.imageId}`}
            index={firstType ? index - 1 : index}
            className={'item'}
            data={item}
            {...props}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupList;
