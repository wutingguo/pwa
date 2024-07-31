import React, { memo } from 'react';

import { XDropdown, XIcon } from '@common/components';

import './index.scss';

const Popover = props => {
  const renderOptionItem = item => {
    const { type, action, label } = item;
    return (
      <li key={type}>
        <a className={type} onClick={() => action(item)}>
          <XIcon type={type} iconWidth={12} iconHeight={12} title={label} text={label} />
        </a>
      </li>
    );
  };
  const getDropdownProps = () => {
    const { item, action, dropdownList } = props;
    return {
      label: '',
      arrow: 'right',
      dropdownList: dropdownList || [
        {
          type: 'rename',
          label: '分享',
          action: () => action.handleShare(item),
        },
        {
          type: 'delete',
          label: '删除',
          action: () => action.handleDelete(item),
        },
      ],
      renderLable: label => (
        <XIcon type="more-label" iconWidth={12} iconHeight={12} title={label} text={label} />
      ),
      renderOptionItem,
      customClass: 'popover-handler',
    };
  };
  return (
    <div className="cxPopover">
      <XDropdown {...getDropdownProps()} />
    </div>
  );
};

export default memo(Popover);
