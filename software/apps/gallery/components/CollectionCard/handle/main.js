import React from 'react';
import { XIcon } from '@common/components';

const renderOptionItem = item => {
  const { type, action, label } = item;
  return (
    <li key={type}>
      <a className={type} onClick={() => action(item)}>
        <XIcon
          type={type}
          iconWidth={12}
          iconHeight={12}
          title={label}
          text={label}
        />
      </a>
    </li>
  );
};

const getDropdownProps = that => {
  const { item, handleEdit, handleDelete } = that.props;
  return {
    label: '',
    arrow: 'right',
    dropdownList: [
      {
        type: 'rename',
        label: t('QUICK_EDIT'),
        action: () => handleEdit(item)
      },
      {
        type: 'delete',
        label: t('DELETE_COLLECTION'),
        action: () => handleDelete(item),
      }
    ],
    renderLable: label => (
      <XIcon
        type="more-label"
        iconWidth={12}
        iconHeight={12}
        title={label}
        text={label}
      />
    ),
    renderOptionItem,
    customClass: 'collection-handler'
  };
};
export default {
  getDropdownProps
};
