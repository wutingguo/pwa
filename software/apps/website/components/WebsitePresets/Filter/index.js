import cls from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Select from '../components/Select';
// import XSelect from '@resource/components/XSelect';
import { getTagIdOptions, statusEnum, subjectEnum } from '../service';

import './index.scss';

const controlMap = {
  select: Select,
};

const statusFilterControl = {
  controlType: 'select',
  name: 'status',
  label: 'Status',
  options: [
    {
      value: '',
      label: 'All',
    },
    {
      value: statusEnum.private,
      label: 'Private',
    },
    {
      value: statusEnum.published,
      label: 'Published',
    },
  ],
};

const filterConfig = {
  [subjectEnum.website]: [
    {
      subject: subjectEnum.website,
      controlType: 'select',
      name: 'tagId',
      label: 'Category',
      options: [],
    },
    statusFilterControl,
  ],
  [subjectEnum.page]: [
    {
      subject: subjectEnum.page,
      controlType: 'select',
      name: 'tagId',
      label: 'Type',
      options: [],
    },
    statusFilterControl,
  ],
  [subjectEnum.section]: [
    {
      subject: subjectEnum.section,
      controlType: 'select',
      name: 'tagId',
      label: 'Type',
      options: [],
    },
    statusFilterControl,
  ],
};

const getFilterByName = (subject, name) => {
  const filters = filterConfig[subject] || [];
  return filters.find(f => f.name === name);
};

const prefixCls = 'zno-website-designer-page-filters';

const Filter = ({ baseUrl, subject = subjectEnum.website, onChange }) => {
  const [loading, setLoading] = useState(false);

  const init = useCallback(async () => {
    const tagIdFilter = getFilterByName(subject, 'tagId');
    // 数据缓存 有的话不再拉取
    if (!tagIdFilter || tagIdFilter.options.length) return;
    setLoading(true);
    try {
      const options = await getTagIdOptions({ baseUrl, subject });
      tagIdFilter.options = options;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, subject]);

  useEffect(() => {
    init();
  }, [init]);

  const filters = filterConfig[subject];

  if (!filters) return null;

  return (
    <div className={prefixCls}>
      {filters.map(filter => {
        const { controlType, name, label, ...props } = filter;
        const Control = controlMap[controlType];
        if (!Control) return null;

        return (
          <div className={`${prefixCls}-item`}>
            <span className={`${prefixCls}-item-label`}>{label}: </span>
            <Control
              {...props}
              className={cls(`${prefixCls}-item-control`, props.className)}
              onChange={v => onChange(name, v)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Filter;
