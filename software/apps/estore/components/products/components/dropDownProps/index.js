import React from 'react';
import { XIcon } from '@common/components';
import deletPng from '@resource/static/icons/handleIcon/delet.png';
import editorPng from '@resource/static/icons/handleIcon/editor.png';
import listPng from '@resource/static/icons/handleIcon/list.png';

const getDropdownProps = props => {
  const { deletSheet, editor, renderLable, key = 'content', assignToCollection = () => {} } = props;
  const dropdownList = [
    {
      type: 'assign_to_collections',
      label: (
        <span className="assign_to_collections" key={`${key}_1`}>
          <img src={listPng} />
          {t('ASSIGNTOCOLLECTIONS')}
        </span>
      ),
      id: `${key}_1`,
      action: assignToCollection
    },
    {
      type: 'delet_price_sheet',
      label: (
        <span className="delet_price_sheet" key={`${key}_2`}>
          <img src={deletPng} />
          {t('DELETE')}
        </span>
      ),
      id: `${key}_2`,
      action: deletSheet
    }
  ];
  if (editor) {
    dropdownList.unshift({
      type: 'edit_price_sheet',
      label: (
        <span className="edit_price_sheet" key={`${key}_3`}>
          <img src={editorPng} />
          {__isCN__ ? '编辑' : 'Edit'}
        </span>
      ),
      id: `${key}_3`,
      action: editor
    });
  }

  return {
    label: '',
    arrow: 'right',
    dropdownList,
    renderLable: label =>
      renderLable ? (
        renderLable()
      ) : (
        <XIcon type="more-label" iconWidth={12} iconHeight={12} title={label} text={label} />
      ),
    customClass: 'collection-handler'
  };
};

export default getDropdownProps;
