import classNames from 'classnames';
import React from 'react';

import './index.scss';

export default function PopupList(props) {
  const { data = [], onChange, value } = props;
  return (
    <div style={{ display: 'flex' }} className="dropdown_box">
      {data.map((item, index) => {
        const child = item.children;
        return (
          <div className="dropdown_list">
            {child.map(record => {
              return (
                <div
                  className={classNames('dropdown_item', {
                    active: value[index] && value[index] === record.key,
                    disabled: record.disabled,
                  })}
                  onClick={() => (!record.disabled ? onChange(record, index + 1) : null)}
                >
                  <span className="dropdown_item_text">{record.label}</span>
                  {record?.children && record.children.length > 0 ? (
                    <span className="dropdown_item_icon">&gt;</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
