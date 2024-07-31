import cls from 'classnames';
import React, { memo } from 'react';

import Button from '../components/Button';
import Empty from '../components/Empty';
import { statusEnum } from '../service';

import pngCopy from './imgs/copy.png';
import pngDelete from './imgs/delete.png';
import pngEdit from './imgs/edit.png';

import './index.scss';

const prefixCls = 'zno-website-designer-page-presets-item';

const buttonText = {
  [statusEnum.private]: 'Make It Public',
  [statusEnum.published]: 'Make It Private',
};

const PresetItem = ({ item, role, onStatus, onDelete, onEdit, onCopy, onRename }) => {
  const { subject, id, name, status, photoId, previewImgUrl = '' } = item || {};

  const isPrivate = status === statusEnum.private;

  return (
    <div className={cls(prefixCls)}>
      <div className={cls(`${prefixCls}-preview`, `subject-${subject}`)}>
        {previewImgUrl ? <img src={previewImgUrl} alt="preview img" /> : <Empty />}
      </div>
      <div className={`${prefixCls}-bar`}>
        {!!String(status) && (
          <Button size="small" black onClick={() => onStatus(item)}>
            {buttonText[status]}
          </Button>
        )}
        {!!name && (
          <div className={`${prefixCls}-name`} onClick={() => onRename(item)}>
            {name}
          </div>
        )}
        <div style={{ flex: 1 }}></div>
        <div className={`${prefixCls}-options`}>
          <img
            className={`${prefixCls}-options-icon`}
            src={pngEdit}
            alt="edit"
            style={{ width: '18px' }}
            onClick={() => onEdit(item)}
          />
          {/* <img className={`${prefixCls}-options-icon`} src={pngCopy} alt="copy" /> */}
          {isPrivate && (
            <img
              className={`${prefixCls}-options-icon`}
              src={pngDelete}
              alt="delete"
              onClick={() => onDelete(item)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PresetItem);
