import Trigger from 'rc-trigger';
import 'rc-trigger/assets/index.css';
import React, { useEffect, useMemo, useState } from 'react';

import Icon from './Components/Icon';
import PopupList from './Components/PopupList';

import './index.scss';

export default function Cascader(props) {
  const { value, onChange, data, style } = props;
  const [popupVisible, setPopupVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [current, setCurrent] = useState([]);

  useEffect(() => {
    init();
  }, [data]);
  useEffect(() => {
    if (!popupVisible) {
      init();
    }
  }, [popupVisible]);

  function init() {
    setDataSource([
      {
        tier: 0,
        key: -1,
        children: data,
      },
    ]);
  }

  useEffect(() => {
    if (typeof value !== undefined && value instanceof Array) {
      setCurrent([...value]);
    }
  }, [value]);

  function onPopupVisibleChange(v) {
    setPopupVisible(v);
  }
  function handleChange(record, index) {
    /**
     * 1. 展开
     *  1.1 层级和上一条相同替换
     *  1.2 层级和上一条不同展开
     */
    let len = dataSource.length;
    while (len > index) {
      dataSource.pop();
      len = dataSource.length;
      handleCurrent([]);
    }

    if (record.children && record.children.length > 0) {
      dataSource.push({
        parentId: record.key,
        key: record.key,
        children: record.children || [],
        tier: index,
        label: record.label,
      });
      handleCurrent([]);
      setDataSource([...dataSource]);
    } else {
      const list = dataSource.filter(item => item.parentId).map(item => item.key);
      list.push(record.key);
      onPopupVisibleChange(false);
      handleCurrent(list);
    }
  }

  function handleCurrent(list) {
    if (typeof onChange === 'function') {
      onChange(list);
      return;
    }
    setCurrent(list);
  }
  const text = useMemo(() => {
    let currentData = [...data];
    let stack = [];
    let values = [...current];
    stack.push(currentData.shift());
    let t = '';
    while (stack.length > 0 && values.length > 0) {
      const node = stack[0];
      const value = values[0];
      if (node.key === value) {
        currentData = node.children ? [...node.children] : [];
        stack.shift();
        values.shift();
        t += node.label + '/';
        if (currentData.length <= 0) continue;
        stack.push(currentData.shift());
      } else {
        if (currentData.length <= 0) continue;
        stack.shift();
        stack.push(currentData.shift());
      }
    }

    return t.length > 0 ? t.slice(0, t.length - 1) : t;
  }, [current, data]);

  return (
    <div className="trigger_box" style={style}>
      <Trigger
        action={['click']}
        popup={<PopupList data={dataSource} onChange={handleChange} value={current} />}
        popupVisible={popupVisible}
        getPopupContainer={trigger => trigger.parentNode}
        // stretch="minWidth"
        popupAlign={{
          points: ['tl', 'bl'],
          offset: [0, 3],
        }}
        onPopupVisibleChange={onPopupVisibleChange}
        popupStyle={{}}
      >
        <div className="trigger_content">
          <div className="trigger_content_search">{text}</div>
          <sapn
            className="trigger_content_icon"
            style={{ transform: popupVisible ? 'translateY(-50%) rotate(180deg)' : '' }}
          />
        </div>
      </Trigger>
    </div>
  );
}
