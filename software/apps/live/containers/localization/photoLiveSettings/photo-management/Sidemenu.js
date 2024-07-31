import cls from 'classnames';
import React, { useEffect, useState } from 'react';

import downloadPNG from '@resource/static/icons/btnIcon/download.png';

import './index.scss';

const SideMenu = props => {
  const { data } = props;
  const [menuData, setMenuData] = useState(data);

  useEffect(() => {
    setMenuData(data);
  }, [data]);

  const handleItemClick = index => {
    const updatedMenuData = menuData.map((item, i) => {
      if (i === index) {
        item.active = true;
      } else {
        item.active = false;
      }
      return item;
    });
    setMenuData(updatedMenuData);
  };

  const handleSubItemClick = (parentIndex, subIndex) => {
    const updatedMenuData = menuData.map((item, i) => {
      if (i === parentIndex) {
        item.submenu = item.submenu.map((subItem, j) => {
          if (j === subIndex) {
            subItem.select = true;
          } else {
            subItem.select = false;
          }
          return subItem;
        });
      }
      return item;
    });
    setMenuData(updatedMenuData);
  };

  return (
    <div className="pm-side-menu">
      {menuData.map((item, index) => (
        <div key={index} className="pm-side-menu-item">
          <div className="pm-side-menu-title" onClick={() => handleItemClick(index)}>
            {/* {item.icon && <img  src={downloadPNG} alt="icon" />} */}
            <svg
              className="pm-side-menu-img"
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="appstore"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path>
            </svg>
            <span className="pm-side-menu-content" title={item.name}>
              {item.name}
            </span>
            <span className="pm-side-menu-arrow">
              {item.active ? (
                <svg
                  viewBox="0 0 1024 1024"
                  focusable="false"
                  data-icon="caret-up"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 1024 1024"
                  focusable="false"
                  data-icon="caret-down"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
                </svg>
              )}
            </span>
          </div>
          {item.active && (
            <ul className="pm-side-submenu">
              {item.submenu.map((subItem, subIndex) => (
                <li
                  key={subIndex}
                  className={cls('pm-side-submenu-title', subItem.select ? 'active' : '')}
                  onClick={() => handleSubItemClick(index, subIndex)}
                >
                  <span className="pm-side-submenu-name">{subItem.name}</span>
                  <span className="pm-side-submenu-number">{subItem.number}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
