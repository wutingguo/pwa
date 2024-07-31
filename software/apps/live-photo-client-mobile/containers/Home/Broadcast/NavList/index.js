import cls from 'classnames';
import React, { useEffect, useState } from 'react';

import service from '@apps/live-photo-client/services';

import './index.scss';

/**
 * @typedef {Object} NavListProps
 * @property {string} baseUrl base url
 * @property {string} albumId 相册id
 * @property {Function} onChangeCategory 点击分类事件
 * @param {NavListProps} props
 * @returns
 */
export default function NavList(props) {
  const { baseUrl, albumId, onChangeCategory } = props;
  const [active, setActive] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!albumId) return;
    queryList();
  }, [albumId]);

  async function queryList() {
    const params = {
      baseUrl,
      enc_album_id: albumId,
    };
    const res = await service.getAlbumCategory(params);
    const newData = res.data || [];
    setData(newData);
    // 默认显示第一个分类的列表
    if (newData.length > 0) {
      const newId = newData?.[0]?.id;
      setActive(newId); // 默认展示第一个分类
      onChangeCategory?.(newId);
    }
  }

  function onClick(id) {
    setActive(id);
    onChangeCategory?.(id);
  }

  /**
   * 当仅有一个分类为显示时，样式同现有，不要出现二级tab页面。仅显示相册菜单的名字
   */
  if (data.length <= 1) {
    return null;
  }

  return (
    <div className={cls('nav_box')}>
      <ul className={cls('nav')}>
        {data.map((item, index) => (
          <li
            className={cls('nav_item', { active: active === item.id })}
            key={item.id}
            onClick={() => onClick(item.id)}
          >
            <span>{item.category_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
