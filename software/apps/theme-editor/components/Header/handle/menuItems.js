import React from 'react';

export function getMenuItems(that) {
  const menuItems = [
    {
      name: 'save',
      title: '保存',
      handler: that.onSave,
    },
    // {
    //   name: 'leave',
    //   title: '退出',
    //   handler: that.onLeave
    // }
  ];
  return menuItems;
}

export function getRenderMenuItems(that) {
  const menuItems = getMenuItems(that);
  const html = menuItems.map(menu => {
    const { name, title, handler } = menu;
    return (
      <li key={`${name}-theme`} className="menu-item" id={`${name}-theme`} onClick={handler}>
        {title}
      </li>
    );
  });
  return <ul className="header-menu-items">{html}</ul>;
}
